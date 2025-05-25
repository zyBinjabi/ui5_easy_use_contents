sap.ui.define([
    "sap/ui/core/mvc/Controller",

], (Controller) => {
    "use strict";

    return Controller.extend("${ez5.appName}.controller.${ez5.controllerName}", {
        async onInit() {
        },

        handleActionPress: function (ev) {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

            var oRouter = UIComponent.getRouterFor(this);

            var sRequestId = 2 // Updaet it with you id.

            oRouter.navTo("${ez5.routeDetails}", { id: sRequestId, layout: oNextUIState.layout });
        }
    });
});