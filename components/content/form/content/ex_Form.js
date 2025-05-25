sap.ui.define(
    [
        "${ez5.appName}/${ez5.packgName}/components/form/FinalValidation",
        "${ez5.appName}/${ez5.packgName}/components/Helper",
    ],
    function (FinalValidation, HelperComponents) {
        "use strict";

        return BaseController.extend("${ez5.appName}.controller.${ez5.controllerName}", {
            onInit: function () {
                this.initialForm()
            },

            // ================================== ### Form ### ==================================
            initialForm: function () { // On Insert Form
                this.formId = "${ez5.controllerName}FormId";
                this.formModel = "${ez5.controllerName}FormModel";
                this.helperFormModel = "${ez5.controllerName}HelperFormModel";
                this.buttonErrMesgId = "${ez5.controllerName}messagePopoverBtnId_";

                this.autoG = [
                    { fieldName: "EmployeeId", value: "", type: "Input", rules: "required|number", visible: true, editable: true },
                    { fieldName: "EmployeeName", value: "", type: "Input", rules: "required|text|min-3|max-25", visible: true, editable: true },
                    { fieldName: "Country", value: "", type: "Select", rules: "required", visible: true, editable: true },
                    { fieldName: "Email", value: "", type: "TextArea", rules: "required|email", visible: true, editable: true },
                    { fieldName: "Time", value: "", type: "DatePicker", rules: "required", visible: true, editable: true }
                ];

                this.helperComponents = new HelperComponents(this, this.autoG);
                this.formValues = this.helperComponents.getValuesFromAutoG();
                this.helperFormValues = this.helperComponents.extractVisibilityAndEditability();

                this.getView().setModel(new sap.ui.model.json.JSONModel(this.formValues), this.formModel);
                this.getView().setModel(new sap.ui.model.json.JSONModel(this.helperFormValues), this.helperFormModel);

                this.finalValidation = new FinalValidation(this, this.formModel, this.pageId, this.autoG, this.buttonErrMesgId); // defination the validation
            },


            handleMessagePopoverPress: function (oEvent) {
                this.finalValidation.handleMessagePopoverPress(oEvent);
            },

            onSubmit_: async function () {
                // Get the data from the form model
                let data = this.getView().getModel(this.formModel).getData();
                console.log({ data });

                // Perform final validation
                if (this.finalValidation.onSave(data)) {
                    return false; // Stop execution if validation fails
                }

                // Show busy indicator while data is being processed
                this.setBusy(this.formId, true);

                // API call to save data: Replace this with your own API call

                // Show success message box
                sap.m.MessageBox.success("Your submission was successful!", {
                    title: "Success", // Optional: Title of the message box
                    onClose: function () {
                        // Optional: Action to take when the message box is closed
                    }
                });

                // to Reset the form data.
                this.initialForm()

                // Hide busy indicator after data is set
                this.setBusy(this.formId, false);
            },

        });
    }
);
