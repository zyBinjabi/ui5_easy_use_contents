sap.ui.define([
    "sap/ui/core/mvc/Controller",

], (Controller) => {
    "use strict";

    // appName, controllerName, details_detailsPageName, detailspageName, GlobalModelName --> need Updae base on ...

    return Controller.extend("${ez5.appName}.controller.${ez5.controllerName}", {
        onInit: async function () {
            this.RouteDetials_details_list1 = "Route${ez5.details_detailsPageName}"

            // Get references to full-screen buttons
            this._oExitButton = this.getView().byId("exitFullScreenBtn");
            this._oEnterButton = this.getView().byId("enterFullScreenBtn");

            // Initialize router and model
            this._oRouter = this.getOwnerComponent().getRouter();
            this._oModel = this.getOwnerComponent().getModel("fclModel");

            // Attach route match handlers
            this._oRouter.getRoute(this.RouteDetials_details_list1).attachPatternMatched(this._onRouteMatched, this);

            // Add event delegates to focus full-screen buttons after rendering
            [this._oExitButton, this._oEnterButton].forEach(function (oButton) {
                oButton.addEventDelegate({
                    onAfterRendering: function () {
                        if (this._bFocusFullScreenButton) {
                            this._bFocusFullScreenButton = false;
                            oButton.focus();
                        }
                    }.bind(this)
                });
            }, this);
        },

        /**
         * Handles the "Enter Full Screen" button press.
         */
        handleFullScreen: function () {
            this._bFocusFullScreenButton = true;

            // Get the layout for full-screen mode
            const sNextLayout = this._oModel.getProperty("/actionButtonsInfo/endColumn/fullScreen");

            this._oRouter.navTo(this.CurrentRouteDetail_details, {
                layout: sNextLayout,
                id: this._id
            });
        },

        /**
         * Handles the "Exit Full Screen" button press.
         */
        handleExitFullScreen: function () {
            this._bFocusFullScreenButton = true;

            // Get the layout for exiting full-screen mode
            const sNextLayout = this._oModel.getProperty("/actionButtonsInfo/endColumn/exitFullScreen");

            this._oRouter.navTo(this.CurrentRouteDetail_details, {
                layout: sNextLayout,
                id: this._id
            });
        },

        /**
         * Handles the "Close" button press.
         */
        handleClose: function () {
            // Get the layout for closing the column
            const sNextLayout = this._oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");

            this._oRouter.navTo(this.RouteDetails, {
                layout: sNextLayout,
                id: this._id
            });
        },

        /**
         * Handles the this.RouteDetials_details_list1 route match event.
         * Binds the product data to the view.
         */
        _onRouteMatched: function (oEvent) {
            let routeName = oEvent.getParameter("name");
            this.CurrentRouteDetail_details = routeName

            switch (routeName) {
                case this.RouteDetials_details_list1:
                    this.RouteDetails = "Route${ez5.detailspageName}";
                    break;
            }

            // Extract the product id from the route arguments
            this._id = oEvent.getParameter("arguments").id || this._id || "0";
        }


    });
});