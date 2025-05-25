sap.ui.define(["${ez5.appName}/${ez5.packgName}/api/OdataV4"], function (OdataV4) {
    "use strict";

    return class UserModel {
        constructor(_componentJS, userData = {}) {
            this._componentJS = _componentJS
            this.odataV4 = new OdataV4()

            this.userData = userData
        }

        hasRole(role) {
            return this.userData.roles?.includes(role) ?? false;
        }

        async getuserInfo(userId, appId) {
            let data;

            if (!this._componentJS.env.getFromSF) {
                return this._componentJS.env.userInfo
            }

            const oModel = this._componentJS.getModel(); // Get the OData model

            let entitySet = "sfUser"
            let payload = [{ key: "userId", value: userId }, { key: "appId", value: appId }]

            try {
                data = await this.odataV4.GETExtr(oModel, entitySet, payload)

                // console.log("Data received in controller:", data);
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
            data = data[0]

            return data
        }

        // static fromApiData(_componentJS, data) {
        //     return new UserModel(_componentJS, {
        //         id: data.user_id,
        //         name: data.full_name,
        //         email: data.mail,
        //         roles: data.user_roles
        //     });
        // }
    };
});
