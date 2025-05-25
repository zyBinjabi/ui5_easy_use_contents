sap.ui.define([], function () {
    "use strict";

    /**
     * Class responsible for loading and managing JSON models in SAP UI5 applications.
     */
    return class LoadJson {
        /**
         * Creates an instance of LoadJson.
         * @param {sap.ui.core.mvc.Controller} controller - The controller to attach models to.
         */
        constructor(controller) {
            this._controller = controller;
            this.sNamespace = "${ez5.appName}";
        }

        /**
         * Initializes the module (can be extended later).
         */
        init() {
            // Placeholder for future initialization logic
        }

        /**
         * Loads multiple JSON models asynchronously.
         * @param {Array<{modelName: string, modelPath: string}>} modelsJson - List of models to load.
         * @returns {Promise<Array<{modelName: string, data: object}>>} Resolves with loaded model data.
         */
        async loadModelsJson(modelsJson) {
            try {
                const modelsData = await Promise.all(
                    modelsJson.map(async (model) => {
                        const oModel = await this.loadAndSetModel(model.modelName, model.modelPath);
                        return {
                            modelName: model.modelName,
                            data: oModel.getData()
                        };
                    })
                );
                return modelsData;
            } catch (error) {
                console.error("Failed to load one or more JSON models", error);
                throw error;
            }
        }

        /**
         * Loads and sets a JSON model to the controller's view.
         * @param {string} modelName - Name to register the model under.
         * @param {string} modelPath - URL path to the JSON file.
         * @returns {Promise<sap.ui.model.json.JSONModel>} Resolves with the loaded model.
         */
        async loadAndSetModel(modelName, modelPath) {
            const oModel = new sap.ui.model.json.JSONModel();
            try {
                await this._loadJSONData(oModel, modelPath);
                this._controller.setModel(oModel, modelName);
                return oModel;
            } catch (error) {
                console.error(`Failed to load model "${modelName}" from ${modelPath}`, error);
                throw error;
            }
        }

        /**
         * Loads JSON data into a model using promise-based API.
         * @param {sap.ui.model.json.JSONModel} oModel - Model to load data into.
         * @param {string} sPath - Path to the JSON file.
         * @returns {Promise<void>}
         * @private
         */
        _loadJSONData(oModel, sPath) {
            return new Promise((resolve, reject) => {
                oModel.loadData(sPath);

                oModel.attachRequestCompleted(() => {
                    resolve(oModel);
                });

                oModel.attachRequestFailed((event) => {
                    const error = event.getParameter("response") || event;
                    reject(error);
                });
            });
        }

        /**
         * Generates model configurations based on a list of model names.
         * @param {string[]} modelsList - Array of model names.
         * @param {string} [basePath='model/'] - Base path inside namespace.
         * @returns {Array<{modelName: string, modelPath: string}>}
         */
        generateModelConfig(modelsList, basePath = "model/") {
            return modelsList.map((modelName) => ({
                modelName,
                modelPath: sap.ui.require.toUrl(`${this.sNamespace}/${basePath}${modelName}.json`)
            }));
        }

        /**
         * Convenience method to generate and load models.
         * @param {string[]} modelsJsonList - Array of model names to load.
         * @returns {Promise<{modelsJson: Array, modelsData: Array}>}
         */
        async getModel(modelsJsonList) {
            const modelsJson = this.generateModelConfig(modelsJsonList);
            let modelsData;

            try {
                modelsData = await this.loadModelsJson(modelsJson);
            } catch (error) {
                console.warn("Some models failed to load", error);
            }

            return {
                modelsJson,
                modelsData
            };
        }
    };
});