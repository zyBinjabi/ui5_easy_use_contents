sap.ui.define([
    "${ez5.appName}/${ez5.packgName}/components/form/Validation_",
    "${ez5.appName}/${ez5.packgName}/components/form/MessagePopoverHelper",
], function (Validation_, MessagePopoverHelper) {
    "use strict";

    return class FinalValidation {
        /**
         * Constructs the FinalValidation instance.
         * @param {sap.ui.core.mvc.Controller} controller - The UI5 controller.
         * @param {string} [modelName='formModel'] - Name of the model.
         * @param {string} [pageId='SampleId'] - Page ID for message handling.
         * @param {Array} [autoG=[]] - Array of field validation rules.
         * @param {string} [messagePopoverBtnId='messagePopoverBtnId_'] - ID of the button to trigger the popover.
         */
        constructor(controller, modelName = "formModel", pageId = "SampleId", autoG = [], messagePopoverBtnId = "messagePopoverBtnId_") {
            this._controller = controller;
            this.modelName = modelName;
            this.pageId = pageId;
            this.autoG = Array.isArray(autoG) ? autoG : [];
            this.messagePopoverBtnId = messagePopoverBtnId;

            this.messagePopoverHelper = new MessagePopoverHelper({
                _controllerJS: this._controller,
                messageHandlingPageId: this.pageId,
                messagePopoverBtnId: this.messagePopoverBtnId
            });
        }

        /**
         * Main entry point to validate and save the form.
         * @param {object} formData - Form data to validate.
         * @returns {boolean} True if errors exist, false otherwise.
         */
        onSave(formData) {
            const model = this._controller.getView()?.getModel(this.modelName);
            if (!model) {
                console.error(`[FinalValidation] Model "${this.modelName}" not found in view.`);
                return true;
            }

            model.attachPropertyChange(this.onModelPropertyChange, this);

            this.messagePopoverHelper?.openMessage();

            return this._validateForm(formData);
        }

        /**
         * Handles press events for the message popover button.
         * @param {sap.ui.base.Event} event - UI5 event.
         */
        handleMessagePopoverPress(event) {
            this.messagePopoverHelper?.handleMessagePopoverPress(event);
        }

        /**
         * Event handler for model property changes.
         * @param {sap.ui.base.Event} event - UI5 propertyChange event.
         */
        onModelPropertyChange(event) {
            const model = this._controller.getView()?.getModel(this.modelName);
            const formData = model?.getData();
            if (formData) {
                this._validateForm(formData);
            } else {
                console.warn(`[FinalValidation] No data found in model "${this.modelName}".`);
            }
        }

        /**
         * Validates the given form data and updates the message popover.
         * @param {object} formData - Form data to validate.
         * @returns {boolean} True if errors exist, false otherwise.
         * @private
         */
        _validateForm(formData) {
            if (!formData || typeof formData !== "object") {
                console.warn("[FinalValidation] No form data provided for validation.");
                return true;
            }

            this.validationInstance = new Validation_(this._controller, this.autoG);
            const valueStates = this.validationInstance.validate(formData);
            const hasErrors = this.validationInstance.hasErrors(valueStates);

            console.debug("[FinalValidation] Value states:", valueStates);
            console.debug("[FinalValidation] Has errors:", hasErrors);

            this.messagePopoverHelper?.createMessagesForForm(this.modelName, valueStates);

            return hasErrors;
        }

        /**
         * Extracts rules from the autoG configuration.
         * @param {Array} autoG - Validation rules array.
         * @returns {Array} Array of [fieldName, rules] pairs.
         */
        extractRules(autoG) {
            if (!Array.isArray(autoG)) return [];
            return autoG.map(item => [item.fieldName, item.rules]);
        }

        /**
         * Overwrites the rules of the given fieldName in this.autoG.
         * @param {string} fieldName - The field to update.
         * @param {string} newRules - The new rules string.
         */
        updateRulesForField(fieldName, newRules) {
            if (!fieldName || typeof newRules !== "string") {
                console.warn("[FinalValidation] Invalid parameters for updateRulesForField.");
                return;
            }

            const field = this.autoG.find(item => item.fieldName === fieldName);
            if (field) {
                field.rules = newRules;
                console.debug(`[FinalValidation] Updated rules for "${fieldName}" to "${newRules}".`);
            } else {
                console.warn(`[FinalValidation] Field "${fieldName}" not found in autoG.`);
            }
        }

    };
});
