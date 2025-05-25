sap.ui.define([
    "${ez5.appName}/${ez5.packgName}/auth/AuthService",
    "${ez5.appName}/${ez5.packgName}/auth/AccessControl",
    "${ez5.appName}/${ez5.packgName}/auth/UserModel",
    "${ez5.appName}/${ez5.packgName}/auth/PagesAccess",
], (AuthService, AccessControl, UserModel, PagesAccess) => {
    "use strict";


    return UIComponent.extend("${ez5.appName}.Component", {
        async init() {
            // ==========##  (Auth) Section ##========== //
            this.userId = this.getUserIdFromUshell() || this.env.userInfo.userId
            this.appId = this.env.appId;

            // ==========##  (Auth) Section ##========== //
            this.userModel = new UserModel(this);          // pass the controller / component
            this.authService = new AuthService(this);
            this.accessControl = new AccessControl(this);
            this.pagesAccess = new PagesAccess(this);


            // ==========##  (Auth) Section ##========== //
            const success = await this.authService.login({ username: this.userId, password: this.appId });
            if (!success) {
                return
            }

            this.setModel(
                new sap.ui.model.json.JSONModel(this.authService.getUser()),
                "userInfo"
            );

            const canAccess = this.accessControl.canAccess('normalAccess')
            if (!canAccess) {
                return
            }

            this.pagesAccess.setAuthorizedPages()
            this.pagesAccess.filterNavigation()

            this.getRouter().attachRouteMatched(this.pagesAccess._onRouteMatched, this.pagesAccess); // for insure the user have access (Rules)
        },

        // ==========## Get User ##========== //
        async getSlcUserInfo(userId) {
            return await this.getUserSF.getSlcUsers(userId)
        },

        // ==========## Get User ##========== //
        async getAllUserInfo() {
            return await this.getUserSF.getAllUsers()
        },
    });
});