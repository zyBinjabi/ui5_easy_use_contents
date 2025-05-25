sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("${ez5.appName}.${ez5.packgName}.CRUDoData", {
            // Constructor function to store the reference of the current controller
            constructor: function (currentController, oModelName = "", isComponent = false) {
                Controller.apply(this, currentController);

                this._currentController = currentController;


                this.oModel = oModelName == "" ? this._currentController.getOwnerComponent()?.getModel() : isComponent ? this._currentController.getModel(oModelName) : this._currentController.getOwnerComponent()?.getModel(oModelName);
            },
            // =========Start OF CRUD.=========
            /**
             * Retrieves records from the specified endpoint.
             * @param {string} endPoint - The endpoint from which to retrieve records.
             * @param {string} [id=''] - Optional. The ID of the record to retrieve.
             * @param {string} [name=''] - Optional. The name of the record to retrieve.
             * @param {Object} [filter={}] - Optional. Additional filters for the query.
             * @returns {Promise<any>} A promise that resolves with the retrieved records.
             */
            // get_record: async function (endPoint, id = '', filter = {}) {
            //     console.log("filter.name", filter.name)
            //     console.log("filter.name", typeof(filter.name))

            //     console.log("filter.value", filter.value)
            //     console.log("filter.value", typeof(filter.value))

            //     // var oBusyDialog = this._currentController.onBusyDialog()
            //     // oBusyDialog.open()

            //     let name = ''

            //     var keys = name !== '' 
            //     ? "/ " + endPoint + " (Id = '" + id + "', Name = '" + name + "')" 
            //     : "/ " + endPoint + " ('" + id + "')";

            //     var path = id === '' ? "/ " + endPoint : keys;

            //     // console.log('res: ', path)
            //     var oFilter;

            //     let filterValue = filter?.value?.toString(); // Ensuring the value is treated as a string

            //     if (Object.keys(filter).length !== 0) {
            //         oFilter = new sap.ui.model.Filter(filter.name, "EQ", filterValue);
            //     } else {
            //         oFilter = [];
            //     }

            //     console.log("path", path)
            //     console.log("path", typeof(path))

            //     console.log("oFilter", oFilter)
            //     console.log("oFilter", typeof(oFilter))
            //     try {
            //         var outRes = await new Promise((resolve, reject) => {
            //             this.oModel.read(path, {
            //                 filters: [oFilter],
            //                 success: function (res) {
            //                     resolve(res); // Resolve the promise with the response
            //                     // console.log('res: ', res)

            //                 },
            //                 error: function (err) {
            //                     console.error(err);
            //                     reject(err); // Reject the promise with the error
            //                 }
            //             });
            //         });
            //         // oBusyDialog.close()

            //         return outRes; // Return the response outside of the promise
            //     } catch (error) {
            //         // this._currentController.getView().setBusy(false)
            //         console.error(error);
            //         // oBusyDialog.close()

            //         return null; // Handle errors by returning null or another value
            //     }

            // },

            get_record: async function (endPoint, id = '', filter = {}) {
                let oFilter = [];

                // Check if filter object is provided and has a name and value
                if (filter.name && filter.value) {
                    let filterValue = filter.value.toString(); // Convert value to string
                    oFilter.push(new sap.ui.model.Filter(filter.name, "EQ", filter.value));
                    // oFilter.push(new sap.ui.model.Filter(filter.name, sap.ui.model.FilterOperator.Contains, filter.value));
                }

                // Construct the path based on the presence of `id`
                let path = id ? `/${endPoint}('${id}')` : `/${endPoint}`;

                try {
                    const outRes = await new Promise((resolve, reject) => {
                        this.oModel.read(path, {
                            filters: oFilter,
                            success: function (res) {
                                resolve(res); // Resolve the promise with the response
                            },
                            error: function (err) {
                                console.error(err);
                                reject(err); // Reject the promise with the error
                            }
                        });
                    });

                    return outRes; // Return the response outside of the promise
                } catch (error) {
                    console.error(error);
                    return null; // Handle errors by returning null or another value
                }
            },

            post_record: async function (endPoint, oPayload) {
                try {
                    var res = await new Promise((resolve, reject) => {
                        this.oModel.create("/" + endPoint, oPayload, {
                            success: function (res) {
                                // console.log("Res of Creating: ",  res )

                                resolve(res); // Resolve the promise with the response
                            }.bind(this),
                            error: function (err) {
                                reject(err); // Reject the promise with the error
                            }
                        })
                    });
                    return res
                } catch (error) {
                    console.error(error);
                    return null; // Handle errors by returning null or another value  
                }
            },

            update_record: async function (endPoint, oPayload, id) {
                let name = '';
                let path = name === ''
                    ? "/" + endPoint + "('" + id + "')"
                    : "/" + endPoint + "(Id = '" + id + "', Name ='" + name + "')";

                try {

                    var res = await new Promise((resolve, reject) => {
                        this.oModel.update(path, oPayload, {
                            success: function (res) {
                                // console.log("Res of Updating: ",  res )
                                resolve(res); // Resolve the promise with the response
                            }.bind(this),
                            error: function (err) {
                                // console.log({ err })
                                reject(err); // Reject the promise with the error
                            }
                        })
                    });
                    return res

                } catch (error) {
                    console.error(error);
                    return error; // Handle errors by returning null or another value  
                }
            },

            delete_record: async function (endPoint, id) {
                let name = ''
                try {
                    var res = await new Promise((resolve, reject) => {
                        let path = name === ''
                            ? "/" + endPoint + "('" + id + "')"
                            : "/" + endPoint + "(Id = '" + id + "', Name ='" + name + "')";
                        this.oModel.remove(path, {
                            success: function (res) {
                                resolve(res); // Resolve the promise with the response
                            }.bind(this),
                            error: function (err) {
                                reject(err); // Reject the promise with the error
                            }
                        })
                    });
                    return res
                } catch (error) {
                    console.error(error);
                    return null; // Handle errors by returning null or another value  
                }
            },
            // =========END OF CRUD.=========

            // =========Start OF Modle.=========
            /**
             * Retrieves records from the specified endpoint.
             * @param {string} endPoint - The endpoint from which to retrieve records.
             * @param {string} [id=''] - Optional. The ID of the record to retrieve.
             * @param {Object} [filter={}] - Optional. Additional filters for the query.
             * @param {string} modelName - The name of the model.
             * @returns {Promise<any>} A promise that resolves with the retrieved records.
             */
            get_record_set_model: async function (endPoint, id = '', filter = {}, modelName, callBack = function (results) { return results; }) {
                const res = await this.get_record(endPoint, id, filter)

                if (res && Array.isArray(res.results)) {
                    var results = res.results.map(item => {
                        // Iterate over each property of the item
                        for (let prop in item) {
                            // Convert the property value to a string
                            item[prop] = String(item[prop]);
                        }
                        return item;
                    });
                    results = await callBack(results)
                    this._currentController.getView().setModel(new sap.ui.model.json.JSONModel(results), modelName)
                }

                return res
            },

            post_record_set_model: async function (endPoint, oPayload, modelName, callBack = function (results) { return results; }) {
                const res = await this.post_record(endPoint, oPayload)
                if (res) {
                    this.get_record_set_model(endPoint, '', {}, modelName, callBack)
                }
                return res
            },

            update_record_set_model: async function (endPoint, oPayload, modelName, callBack = function (results) { return results; }) {
                const res = await this.update_record(endPoint, oPayload, oPayload.Id)
                this.get_record_set_model(endPoint, '', {}, modelName, callBack)
                return res

            },

            delete_record_set_model: async function (endPoint, id, modelName, callBack = function (results) { return results; }) {
                const res = await this.delete_record(endPoint, id, "")
                this.get_record_set_model(endPoint, '', {}, modelName, callBack)
                return res
            },
            // =========End OF Modle.=========
        });
    }
);
