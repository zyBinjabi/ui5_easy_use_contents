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
        this.isDarkMode = true;
        this.onToggleTheme();
        this.onMenuButtonPress();

        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.attachRouteMatched(this.onRouteMatched, this);
        this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);

        this.oMyAvatar = this.oView.byId("Avatar_id");
        this._oPopover = Fragment.load({
          id: this.oView.getId(),
          name: "${ez5.appName}.fragment.auth.Popover",
          controller: this
        }).then(function (oPopover) {
          this.oView.addDependent(oPopover);
          this._oPopover = oPopover;
        }.bind(this));
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
      onRouteMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name")

        const oSideNav = this.byId("sideNav"); //NavigationList ID
        if (oSideNav) {
          oSideNav.setSelectedKey(sRouteName);
        }

      },

    });
  }
); 