sap.ui.define([
    "sap/ui/core/mvc/Controller",

], (Controller) => {
    "use strict";

    // appName, controllerName, detailsPageName, listPageName, pageNameDetails_Detatils1, GlobalModelName --> need Updae base on ...

    return Controller.extend("${ez5.appName}.controller.${ez5.controllerName}", {
        onInit: async function () {
            this.RouteDetials_list1 = "Route${ez5.detailsPageName}"

            // Get references to full-screen buttons
            this._oExitButton = this.getView().byId("exitFullScreenBtn");
            this._oEnterButton = this.getView().byId("enterFullScreenBtn");

            // Initialize router and model
            this._oRouter = this.getOwnerComponent().getRouter();
            this._oModel = this.getOwnerComponent().getModel("fclModel");

            // Attach route match handlers
            this._oRouter.getRoute(this.RouteDetials_list1).attachPatternMatched(this._onRouteMatched, this);

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
         * Handles item press events in the this.RouteDetials_list1 view.
         * Navigates to the "detailDetail" route with the selected supplier.
         */
        handleItemPress: function (oEvent) {
            // Get the next UI state for two columns
            const oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);


            // Navigate to the "detailDetail" route
            this._oRouter.navTo(this.RouteDetails_Details, {
                layout: oNextUIState.layout,
                id: this._id
            });
        },

        /**
         * Handles the "Enter Full Screen" button press.
         */
        handleFullScreen: function () {
            this._bFocusFullScreenButton = true;

            // Get the layout for full-screen mode
            const sNextLayout = this._oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");

            this._oRouter.navTo(this.CurrentRouteDetail, {
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
            const sNextLayout = this._oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");

            this._oRouter.navTo(this.CurrentRouteDetail, {
                layout: sNextLayout,
                id: this._id
            });
        },

        /**
         * Handles the "Close" button press.
         */
        handleClose: function () {
            // Get the layout for closing the column
            const sNextLayout = this._oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");

            this._oRouter.navTo(this.RouteList, {
                layout: sNextLayout
            });
        },

        /**
         * Handles the this.RouteDetials_list1 route match event.
         * Binds the product data to the view.
         */
        _onRouteMatched: function (oEvent) {
            let routeName = oEvent.getParameter("name");
            this.CurrentRouteDetail = routeName

            switch (routeName) {
                case this.RouteDetials_list1:
                    this.RouteList = "Route${ez5.listPageName}";
                    this.RouteDetails_Details = "Route${ez5.pageNameDetails_Detatils1}";
                    break;
            }

            // Extract the product id from the route arguments
            this._id = oEvent.getParameter("arguments").id || this._id || "0";

            let oModel = this.getOwnerComponent().getModel("${ez5.GlobalModelName}");
            if (oModel) {
                this.requestsData = oModel.getData();
            } else {
                console.warn("Model not found!");
            }
        }


    });
});