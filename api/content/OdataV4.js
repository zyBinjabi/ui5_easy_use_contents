sap.ui.define([], function () {
    "use strict";

    return class OdataV4 {
        constructor(_controllerJS) {
            this._controllerJS = _controllerJS;
        }

        init() { }

        /**
         * Asynchronous function to fetch data from an OData V4 model.
         *
         * @param {sap.ui.model.odata.v4.ODataModel} model - The OData V4 model instance.
         * @param {string} entitySet - The name of the entity set to query.
         * @param {Array|sap.ui.model.Filter|null} [filters=null] - Filters to apply to the query.
         * @param {string|null} [select=null] - Comma-separated list of properties to select.
         * @param {string|null} [expand=null] - Comma-separated list of navigation properties to expand.
         * @param {number} [skip=0] - Number of records to skip.
         * @param {number} [top=Number.MAX_SAFE_INTEGER] - Maximum number of records to retrieve.
         * @returns {Promise<Array>} A promise that resolves with the fetched data as an array of objects.
         */
        async GET(model, entitySet, filters = null, select = null, expand = null, skip = 0, top = Number.MAX_SAFE_INTEGER) {
            try {
                // Validate input parameters
                if (!model || !(model instanceof sap.ui.model.odata.v4.ODataModel)) {
                    throw new Error("Invalid OData V4 model.");
                }
                if (typeof entitySet !== "string" || entitySet.trim() === "") {
                    throw new Error("Entity set must be a non-empty string.");
                }
                if (skip < 0 || !Number.isInteger(skip)) {
                    throw new Error("Skip value must be a non-negative integer.");
                }
                if (top <= 0 || !Number.isInteger(top)) {
                    throw new Error("Top value must be a positive integer.");
                }

                // Define query options based on provided parameters
                const queryOptions = {};
                if (select && typeof select === "string") {
                    queryOptions.$select = select.trim();
                }
                if (expand && typeof expand === "string") {
                    queryOptions.$expand = expand.trim();
                }

                // Create the list binding with the specified entity set and query options
                const listBinding = model.bindList(entitySet, undefined, undefined, filters, queryOptions);

                // Fetch the contexts from the binding
                const contexts = await listBinding.requestContexts(skip, top);

                // Map the contexts to actual data objects
                const data = contexts.map(context => context.getObject());

                // Log the fetched data for debugging purposes
                console.log(`[${entitySet}] Fetched Data:`, data);

                // Return the result
                return data;
            } catch (error) {
                // Handle errors and log detailed information
                console.error("Error fetching data:", error);

                // Display an error message box with user-friendly information
                sap.m.MessageBox.error(
                    error.cause?.message || "An error occurred while fetching data.",
                    {
                        title: "Data Fetch Error",
                        actions: sap.m.MessageBox.Action.CLOSE,
                        onClose: () => {
                            // Optionally handle the close action if needed
                        },
                    }
                );

                // Rethrow the error to ensure the promise rejects
                throw error;
            }
        }

        /**
         * Fetch data from an OData V4 model with additional parameters.
         *
         * @param {sap.ui.model.odata.v4.ODataModel} oModel - The OData V4 model instance.
         * @param {string} entitySet - The name of the entity set to query.
         * @param {Array} oParameters - Array of parameters to set.
         * @returns {Promise<Array>} A promise that resolves with the fetched data as an array of objects.
         */
        async GETExtr(oModel, entitySet, oParameters) {
            if (!oModel) {
                throw new Error("OData model is not available.");
            }

            const oActionODataContextBinding = oModel.bindContext(`/${entitySet}(...)`);

            oParameters.forEach(element => {
                oActionODataContextBinding.setParameter(element.key, element.value);
            });

            try {
                await oActionODataContextBinding.execute();
                const jobData = oActionODataContextBinding.getBoundContext();
                const datas = jobData.getObject().value;

                console.log(`${entitySet} |-_-| Datas: `, datas);

                return datas;
            } catch (error) {
                console.error("Failed to fetch roles Details", error);
                throw error;
            }
        }

        /**
         * Create a new entry in the specified entity set.
         *
         * @param {sap.ui.model.odata.v4.ODataModel} model - The OData V4 model instance.
         * @param {string} entitySet - The name of the entity set to create the entry in.
         * @param {Object} newData - The data for the new entry.
         * @returns {Promise<Object>} A promise that resolves with the created record.
         */
        async POST(model, entitySet, newData) {
            try {
                const createBinding = model.bindList(entitySet);
                await createBinding.create(newData);
                console.log("newData: ", newData);

                const filterBinding = model.bindList(entitySet);
                const filters = Object.keys(newData).map(key => new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, newData[key]));
                console.log("filters: ", filters);

                filterBinding.filter(filters);
                const contexts = await filterBinding.requestContexts();

                if (contexts.length > 0) {
                    const createdRecord = contexts[0].getObject();
                    console.log("createdRecord: ", createdRecord);
                    return createdRecord;
                } else {
                    console.warn("No matching record found after creation.");
                }
            } catch (error) {
                console.error("Error creating or fetching entity:", error);
                throw error;
            }
        }

        /**
         * Update an entry in the specified entity set.
         *
         * @param {sap.ui.model.odata.v4.ODataModel} model - The OData V4 model instance.
         * @param {string} entitySet - The name of the entity set to update the entry in.
         * @param {Array} aFilter - Array of filters to locate the specific entry.
         * @param {Object} updatedData - The data to update the entry with.
         * @returns {Promise<void>}
         */
        async PUT(model, entitySet, aFilter, updatedData) {
            try {
                const oBindList = model.bindList(entitySet);
                const aContexts = await oBindList.filter(aFilter).requestContexts();

                if (aContexts.length > 0) {
                    const oContext = aContexts[0];
                    Object.entries(updatedData).forEach(([key, value]) => {
                        oContext.setProperty(key, value);
                    });
                    sap.m.MessageToast.show("Record Updated successfully!");
                } else {
                    sap.m.MessageToast.show("No matching record found.");
                }
            } catch (error) {
                sap.m.MessageBox.error(error?.message);
                console.error("Error updating entry in " + entitySet + ":", error);
                throw error;
            }
        }

        /**
         * Delete an entry in the specified entity set.
         *
         * @param {sap.ui.model.odata.v4.ODataModel} model - The OData V4 model instance.
         * @param {string} entitySet - The name of the entity set to delete the entry from.
         * @param {Array} aFilter - Array of filters to locate the specific entry.
         * @returns {Promise<void>}
         */
        async DELETE(model, entitySet, aFilter) {
            try {
                const oBindList = model.bindList(entitySet, undefined, undefined, aFilter);
                const aContexts = await oBindList.requestContexts();

                if (aContexts.length > 0) {
                    const oContext = aContexts[0];
                    await oContext.delete();
                    sap.m.MessageToast.show("Record Deleted Successfully!");
                } else {
                    sap.m.MessageToast.show("No matching record found.");
                }
            } catch (error) {
                sap.m.MessageBox.error("Error deleting entry: " + error.message);
                console.error("Error deleting entry from " + entitySet + ":", error);
                throw error;
            }
        }

        /**
         * Perform a POST request to the specified URL with the provided data.
         *
         * @param {string} url - The URL to send the POST request to.
         * @param {Object} newData - The data to include in the POST request.
         * @returns {Promise<Object|null>} A promise that resolves with the response data or null if an error occurs.
         */
        async FETCH_POST(url, newData) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData),
                });
                const res = await response.json();
                if (!response.ok) {
                    sap.m.MessageBox.error(`Status ${res.error.code} - ${res.error.message}`);
                    return null;
                }
                return res;
            } catch (error) {
                sap.m.MessageBox.error(error.message);
                throw error;
            }
        }
    };
});
