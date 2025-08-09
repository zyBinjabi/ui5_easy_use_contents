sap.ui.define([],
  function () {
    "use strict";

    return Controller.extend("${ez5.appName}.controller.App", {
      onBeforeRouteMatched: function (oEvent) {
        var oModel = this.getOwnerComponent().getModel("fclModel");
      },

    });
  }
); 