sap.ui.define(["${ez5.appName}/${ez5.packgName}/api/OdataV4"],
    function (OdataV4) {
        "use strict";

        return class ExOdataV4 {
            constructor(_controllerJS) {
                this._controllerJS = _controllerJS
            }

            async onInit() {
                //  ====================== ## oDataV4 ## ======================
                this.oDatav4 = new OdataV4(this)
            }

            // ================================== # GET # ==================================
            async onGetData_() {
                const oModel = this.getOwnerComponent().getModel(); // Get the OData model
                const entitySet = "/${ez5.entitySet}"; // Target entity set
                const filters = []; // Add your filters if needed
                const select = ""; // Add fields to select if needed
                const expand = null; // Add $expand if needed

                try {
                    const data = await this.oDatav4.GET(oModel, entitySet, filters, select, expand, 0, 50);
                    console.log("Data received in controller:", data);
                } catch (error) {
                    console.error("Error while fetching data:", error);
                }
            }

            async onSetData_() {
                const oModel = this.getOwnerComponent().getModel(); // Get the OData model
                const entitySet = "/${ez5.entitySet}"; // Target entity set
                const sendData = {
                    ...data
                }

                let record = null;
                try {
                    record = await this.oDatav4.POST(oModel, entitySet, sendData);
                } catch (error) {
                    console.error("Error while fetching data:", error);
                }
            }

            // ================================== # Post # ==================================

        }

    });