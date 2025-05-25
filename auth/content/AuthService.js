sap.ui.define(["sap/m/MessageBox"], function (MessageBox) {
    "use strict";

    return class AuthService {
        constructor(_componentJS) {
            this._componentJS = _componentJS
            this.userModel = this._componentJS.userModel;        // holds data + helpers

            this.currentUser = null;
            this.token = null;
        }


        async login(credentials) {
            if (!credentials) {
                MessageBox.error("Login failed");
                return false;    
            }

            this.token = "secure-token-123"; // you would use real tokens here

            this.currentUser = await this.userModel.getuserInfo(credentials.username, credentials.password);
            this.userModel.userData = this.currentUser

            return true;
        }

        logout() {
            this.token = null;
            this.currentUser = null;
        }

        isAuthenticated() {
            return !!this.token;
        }

        getUser() {
            return this.currentUser;
        }
    };
});
