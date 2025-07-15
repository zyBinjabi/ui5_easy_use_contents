sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/tnt/ToolPage",
    "sap/ui/core/routing/Router",
    "sap/ui/core/Fragment",
    "sap/ui/core/Configuration",
  ],
  function (Controller, UIComponent, ToolPage, Router, Fragment, Configuration) {
    "use strict";

    return Controller.extend("${ez5.appName}.controller.App", {
      onInit: function () {
        const pageId = this.getView().getId();
        console.log("pageId :", pageId)
        this.isDarkMode = true;
        this.onToggleTheme();
        this.onMenuButtonPress();

        // this.oMyAvatar = this.oView.byId("Avatar_id");
        // this._oPopover = Fragment.load({
        //   id: this.oView.getId(),
        //   name: "${ez5.appName}.fragment.auth.Popover",
        //   controller: this
        // }).then(function (oPopover) {
        //   this.oView.addDependent(oPopover);
        //   this._oPopover = oPopover;
        // }.bind(this));

      },
      onMenuButtonPress: function () {
        var toolPage = this.byId('toolPage');
        if (toolPage) {
          toolPage.setSideExpanded(!toolPage.getSideExpanded());
        }
      },

      onItemSelect: function (ev) {
        var oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo(ev.getParameter('item').getKey())
      },

      onToggleTheme: function () {
        if (!this.isDarkMode) {
          Configuration.setTheme("sap_horizon"); // Set to normal theme
          this.byId("themeToggleButton").setTooltip("Switch to Dark Mode");
          this.byId("themeToggleButton").setIcon("sap-icon://light-mode");
        } else {
          Configuration.setTheme("sap_horizon_dark"); // Set to dark theme
          this.byId("themeToggleButton").setTooltip("Switch to Light Mode");
          this.byId("themeToggleButton").setIcon("sap-icon://dark-mode");
        }
        this.isDarkMode = !this.isDarkMode;
      },

      onChangeLanguage: function () {
        this.getOwnerComponent().onChangeLanguage();
      },

      // ====================== for dev eara (Production = false) ======================
      onPressAvatar: function (oEvent) {
        var oEventSource = oEvent.getSource(),
          bActive = this.oMyAvatar.getActive();

        this.oMyAvatar.setActive(!bActive);

        if (bActive) {
          this._oPopover.close();
        } else {
          this._oPopover.openBy(oEventSource);
        }
      },

      onPopoverClose: function () {
        this.oMyAvatar.setActive(false);
      },

      onListItemPress: function () {
        this.oMyAvatar.setActive(false);
        this._oPopover.close();
      },


      NewItempress: function (oEvent) {
        var oNewItem = this.byId("NewItemId");
        var sStoredUserId = localStorage.getItem("UserId");
        var sStoredUserRole = localStorage.getItem("UserRole") || '';
        if (oNewItem) {
          oNewItem.setTitle(sStoredUserId + " - " + sStoredUserRole); // Set your desired title
        }
      },

      onNewItemSubmit: function (oEvent) {
        // Get the value from the Input field
        var oInput = this.byId("ChangingUserId");
        var sValue = oInput.getValue();

        // Store the value in local storage
        localStorage.setItem("UserId", sValue);

        // Optional: Log the value to confirm it was saved
        // console.log("User ID saved:", sValue);
      },

      onNewItemSubmitRole: function (oEvent) {
        // Get the value from the Input field
        var oInput = this.byId("ChangingUserRole");
        var sValue = oInput.getValue();

        // Store the value in local storage
        localStorage.setItem("UserRole", sValue);

        // Optional: Log the value to confirm it was saved
        // console.log("User Role saved:", sValue);
      },

      // ====================== +++ ======================
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