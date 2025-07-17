sap.ui.define([
    "sap/ui/core/UIComponent",
    "${ez5.appName}/model/models",
    "${ez5.appName}/${ez5.packgName}/i18n/Language",
    "${ez5.appName}/${ez5.packgName}/Helper/Env",
    "${ez5.appName}/${ez5.packgName}/initapp/LoadJson",
    "${ez5.appName}/${ez5.packgName}/auth/AuthService",
    "${ez5.appName}/${ez5.packgName}/auth/AccessControl",
    "${ez5.appName}/${ez5.packgName}/auth/UserModel",
    "${ez5.appName}/${ez5.packgName}/auth/PagesAccess",
], (UIComponent, models, Language, Env, LoadJson, AuthService, AccessControl, UserModel, PagesAccess) => {
    "use strict";

    return UIComponent.extend("${ez5.appName}.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        async init() {
            // ## call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // ## set the device model
            this.setModel(models.createDeviceModel(), "device");


            // ==============================##  Env Section ##============================== //
            const env = new Env(this) // Env
            this.env = env.init()
            this.setModel(new sap.ui.model.json.JSONModel(this.env), 'env')


            // ==============================## Models Section ##============================== //
            const modelsJsonList = ['navList', 'rulesNavList', 'localData'] // add and update base in your models under (webapp/model)

            const loadJson = new LoadJson(this)
            const { modelsJson, modelsData } = await loadJson.getModel(modelsJsonList)


            // ==============================##  (Auth) Section ##============================== //
            this.userId = this.getUserIdFromUshell() || this.env.userInfo.userId
            this.appId = this.env.appId;

            this.userModel = new UserModel(this);          // pass the controller / component
            this.authService = new AuthService(this);
            this.accessControl = new AccessControl(this);
            this.pagesAccess = new PagesAccess(this);

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

            const filterdNavs = this.pagesAccess.filterNavigation()
            const navListModel = this.getModel(modelsJsonList[0])
            if (navListModel) {
                navListModel.setProperty("/navigation", filterdNavs.navigation);
            }

            this.getRouter().attachRouteMatched(this.pagesAccess._onRouteMatched, this.pagesAccess); // for insure the user have access (Rules)


            // ==============================#### Language Section ##==============================## //
            this.language = new Language(this);
            await this.language.init();
            this.language.replaceModelsJson(modelsJson);


            //  ==============================#### enable routing
            this.getRouter().initialize();
        },

        // ==========## Language ##========== //
        onChangeLanguage: function () {
            return this.language.onChangeLanguage();
        },

        _getUserInfo: async function () {
            //IN prd -- // get user Id From Cloude foundtry retur User Id and rules
            if (this.env.zVars.current_env == "prd" || this.env.zVars.current_env == "qty") {
                this.userFromShell = new UserFromShell(this);
                const { userId } = await this.userFromShell.getUserIdAndRole();
                const { rules } = await this.userFromShell.getUserIdAndRole();
                return { userId, rules }; // retur User Id , Rules of the users
            }

            //IN dev
            return { userId: this.env.zVars.userId, rules: this.env.zVars.userId.rules }; // retur User Id , Rules of the users
        },

        getUserIdFromUshell: function () {
            let userEmail = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")
                ? sap.ushell.Container.getService("UserInfo").getEmail()
                : "";
            return userEmail?.includes('@') ? userEmail.split('@')[0] : userEmail;
        },
    });
});
