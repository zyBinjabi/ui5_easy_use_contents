sap.ui.define(
    [
        "sap/f/library",
        "sap/f/FlexibleColumnLayoutSemanticHelper"

    ],
    function (library, FlexibleColumnLayoutSemanticHelper) {
        "use strict";


        return Controller.extend("${ez5.appName}.controller.App", {

            async init() {

                this.LayoutType = library.LayoutType;

                this.setModel(new sap.ui.model.json.JSONModel({}), 'fclModel');
            },

            getHelper: function () {
                // ==========## FlexibleColumnLayoutSemanticHelper ##========== //
                /**
                 * Returns an instance of the semantic helper
                 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
                 */

                var oFCL = this.getRootControl().byId("app"),
                    oParams = new URLSearchParams(window.location.search),
                    oSettings = {
                        defaultTwoColumnLayoutType: this.LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: this.LayoutType.ThreeColumnsEndExpanded,
                        initialColumnsCount: oParams.get("initial"),
                        maxColumnsCount: oParams.get("max")
                    };

                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            }
        });
    }
); 