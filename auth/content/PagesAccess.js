sap.ui.define([], function () {
    "use strict";

    return class PagesAccess {
        constructor(_componentJS) {
            this._componentJS = _componentJS
            this.accessControl = this._componentJS.accessControl

            this.authorizedPages = []
            this.setNavAndRulesNav()
        }

        setNavAndRulesNav() {
            this.rulesNavList = this._componentJS.getModel("rulesNavList").getData()
            this.navList = this._componentJS.getModel("navList").getData()
        }

        setAuthorizedPages() {
            const roles = this.rulesNavList.roles

            Object.keys(roles).forEach(key => {
                const role = roles[key]

                const canAccess = this.accessControl.canAccess(role)

                if (canAccess) {
                    this.authorizedPages.push(key)
                }
            });
        }

        // Route Access ........ 
        _onRouteMatched(oEvent) {
            var oRouteName = oEvent.getParameter("name");
            const isNavExist = this.authorizedPages.includes(oRouteName);
            if (isNavExist) {
                // pass
            } else {
                this.redirectToHome();
            }
        }

        redirectToHome() {
            new sap.m.MessageToast.show("Access Denied! You don't have permission to access this view!!!");
            this._componentJS.getRouter().navTo("RouteHome"); // Redirect to the home view
        }

        setAuthorizedNavigation() {
            const navigations = this.navList.navigation

            navigations.forEach(navigation => {

                const canAccess = this.accessControl.canAccess(role)

                if (canAccess) {
                    this.authorizedPages.push(key)
                }
            });
        }

        /**
         * Recursively filters navigation items by authorized pages.
         * @param {Object} navData - The full navigation data (with `navigation` array).
         * @param {string[]} authorizedPages - List of allowed route keys.
         * @returns {{navigation: Array}} Filtered navigation object.
         */
        filterNavigation() {
            const authorizedPages = this.authorizedPages
            /**
             * Recursively filters an array of navigation items.
             * @param {Array} items - Navigation items array.
             * @returns {Array} Filtered items.
             */
            function filterItems(items) {
                if (!Array.isArray(items)) return [];

                return items.reduce((acc, item) => {
                    const isAuthorized = authorizedPages.includes(item.key);
                    const hasChildren = Array.isArray(item.items);

                    // Recursively filter children
                    const filteredChildren = hasChildren ? filterItems(item.items) : [];

                    // If item is authorized or has authorized children, include it
                    if (isAuthorized || filteredChildren.length > 0) {
                        acc.push({
                            ...item,
                            ...(hasChildren && { items: filteredChildren }) // Only add back items if they exist
                        });
                    }

                    return acc;
                }, []);
            }

            return {
                navigation: filterItems(this.navList.navigation)
            };
        }

    };
});
