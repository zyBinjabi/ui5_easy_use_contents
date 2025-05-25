sap.ui.define([], function () {
    "use strict";

    return class Env {
        constructor(_componentJS) {
            this._componentJS = _componentJS
        }

        init() {
            let currentEnv = "dev" // dev, qty, prd

            this.env = {
                currentEnv: currentEnv,
                getFromSF: false,
                userInfo: {
                    userId: "30462",
                    username: "Zaid Bp",
                    roles: ["normal", "admin"]
                },
                appId: currentEnv == "prd" ? "3" : "3"
            }

            return this.env
        }

    };
});