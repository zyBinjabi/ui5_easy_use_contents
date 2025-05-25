sap.ui.define([],
  function () {
    "use strict";

    return Controller.extend("${ez5.appName}.controller.App", {
      onInit: function () {

        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.attachRouteMatched(this.onRouteMatched, this);
        this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
      },

      // ====================== Flix Loyte ======================
      onBeforeRouteMatched: function (oEvent) {
        // console.log("onBeforeRouteMatched")

        var oModel = this.getOwnerComponent().getModel("fclModel");

        var sLayout = oEvent.getParameters().arguments.layout;

        // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
        if (!sLayout) {
          var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
          sLayout = oNextUIState.layout;
          // console.log("oNextUIState", oNextUIState)
        }

        // Update the layout of the FlexibleColumnLayout
        if (sLayout) {
          oModel.setProperty("/layout", sLayout);
        }
        // console.log("sLayout", sLayout)
      },

      onRouteMatched: function (oEvent) {
        // console.log("onRouteMatched")

        var sRouteName = oEvent.getParameter("name"),
          oArguments = oEvent.getParameter("arguments");

        this._updateUIElements();

        // Save the current route name
        this.currentRouteName = sRouteName;
        this.currentProduct = oArguments.product;
        this.currentSupplier = oArguments.supplier;
      },

      onStateChanged: function (oEvent) {
        // console.log("onStateChanged")
        var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
          sLayout = oEvent.getParameter("layout");

        this._updateUIElements();

        // Replace the URL with the new layout if a navigation arrow was used
        if (bIsNavigationArrow) {
          this.oRouter.navTo(this.currentRouteName, { layout: sLayout, id: this.currentProduct }, true);
        }
      },

      // Update the close/fullscreen buttons visibility
      _updateUIElements: function () {
        // console.log("_updateUIElements")

        var oModel = this.getOwnerComponent().getModel("fclModel");
        var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
        oModel.setData(oUIState);
      },

      handleBackButtonPressed: function () {
        window.history.go(-1);
      },

      onExit: function () {
        this.oRouter.detachRouteMatched(this.onRouteMatched, this);
        this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
      },
    });
  }
); 