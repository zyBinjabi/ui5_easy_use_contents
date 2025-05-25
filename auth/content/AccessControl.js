sap.ui.define([], function () {
    "use strict";

    return class AccessControl {
        constructor(_componentJS) {
            this._componentJS = _componentJS
            this.authService = this._componentJS.authService
        }

        canAccess(feature) {
            const userModel = this.authService.userModel;
            const user = this.authService.getUser();
            if (!user) return false;
        
            const roleMatrix = {
                "normalAccess": ["normal", "admin"],
                "adminAccess": ["admin"]
            };
        
            // Normalize feature to always be an array
            const features = Array.isArray(feature) ? feature : [feature];
        
            // Check all features — you can also use `.some()` for OR logic
            return features.every(feat => {
                const allowedRoles = roleMatrix[feat] || [];
                return allowedRoles.some(role => userModel.hasRole(role));
            });
        }
    };
});
