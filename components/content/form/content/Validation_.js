sap.ui.define([], function () {
    "use strict";
    return class Validator {
        constructor(_controllerJS, autoG) {
            this._controllerJS = _controllerJS; // Array of rules [["fieldName", "rulesString"], ...]
            this.autoG = autoG; // Array of rules [["fieldName", "rulesString"], ...]
        }

        validate(inputData) {
            const valueStatus = {};
            // Loop through autoG and validate each field
            this.autoG.forEach(({ fieldName, rules, cMessage }) => {
                const fieldValue = inputData[fieldName];
                const ruleList = rules?.split("|");
                const customMessages = cMessage?.split("|");
                let valueState = "Success";
                let valueStateText = [];
                const ERROR_MESSAGES = {
                    REQUIRED: customMessages?.[0] || "Required field!",
                    MAX_LENGTH: length => customMessages?.[1] || `Max length: ${length}`,
                    MIN_LENGTH: length => customMessages?.[2] || `Min length: ${length}`,
                    INVALID_LANG: lang => customMessages?.[3] || `Only ${lang === "en" ? "English" : lang === "ar" ? "Arabic" : lang} characters are allowed!`,
                    MUST_BE_NUMBER: customMessages?.[4] || "Must be a number!",
                    MUST_BE_TEXT: customMessages?.[5] || "Must be a valid text!",
                    INVALID_PERCENTAGE: customMessages?.[6] || "Value must be between 5% and 100%!",
                    INVALID_EMAIL: customMessages?.[7] || "Invalid email format!",
                    INVALID_DATE: customMessages?.[8] || "Value must be Valid Date!",
                    INVALID_DATERANGE: customMessages?.[9] || "Date and time out of range!",
                    AT_LESS_G: len => customMessages?.[8] || `Choose At less (${len}) Permits!`,
                    AT_MAX_G: len => customMessages?.[9] || `The Max is (${len}) Permits!`
                };
                ruleList?.forEach((rule, index) => {
                    let errorMessage = "";
                    if (rule.startsWith("required") && this.isRequiredInvalid(fieldValue)) {
                        errorMessage = ERROR_MESSAGES.REQUIRED;
                    } else if (rule.startsWith("max-") && this.isMaxLengthInvalid(fieldValue, rule)) {
                        const maxLength = rule.split("-")[1];
                        errorMessage = ERROR_MESSAGES.MAX_LENGTH(maxLength);
                    } else if (rule.startsWith("min-") && this.isMinLengthInvalid(fieldValue, rule)) {
                        const minLength = rule.split("-")[1];
                        errorMessage = ERROR_MESSAGES.MIN_LENGTH(minLength);
                    } else if (rule.startsWith("lang-") && this.isLangInvalid(fieldValue, rule)) {
                        const lang = rule.split("-")[1];
                        errorMessage = ERROR_MESSAGES.INVALID_LANG(lang);
                    } else if (rule === "number" && this.isNumberInvalid(fieldValue)) {
                        errorMessage = ERROR_MESSAGES.MUST_BE_NUMBER;
                    } else if (rule === "text" && this.isTextInvalid(fieldValue)) {
                        errorMessage = ERROR_MESSAGES.MUST_BE_TEXT;
                    } else if (rule === "percentage" && this.isPercentageInvalid(fieldValue)) {
                        errorMessage = ERROR_MESSAGES.INVALID_PERCENTAGE;
                    } else if (rule === "email" && this.isEmailInvalid(fieldValue)) {
                        errorMessage = ERROR_MESSAGES.INVALID_EMAIL;
                    } else if (rule === "zDate" && this.isInvalidDate(fieldValue)) {
                        errorMessage = ERROR_MESSAGES.INVALID_DATE;
                    } else if (rule.startsWith("zDate-") && this.dataRangeValidator(fieldValue, rule)) {
                        errorMessage = ERROR_MESSAGES.INVALID_DATERANGE;
                    } else if (rule.startsWith("atLessG") && this.isRuleGroupInvalid(fieldValue, rule)) {
                        const args = rule.split("-")[1]
                        errorMessage = ERROR_MESSAGES.AT_LESS_G(args);
                    } else if (rule.startsWith("atMaxG") && this.isRuleGroupInvalid(fieldValue, rule)) {
                        const args = rule.split("-")[1]
                        errorMessage = ERROR_MESSAGES.AT_MAX_G(args);
                    }

                    if (errorMessage) {
                        valueState = "Error";
                        valueStateText.push(errorMessage);
                    }
                });
                valueStatus[fieldName] = {
                    valueState,
                    valueStateText: valueStateText.join(" - "),
                };
            });
            return valueStatus;
        }

        // New percentage validation method
        isPercentageInvalid(value) {
            const numericValue = typeof value === "string" ? parseFloat(value.replace('%', '')) : value;
            return isNaN(numericValue) || numericValue < 5 || numericValue > 100;
        }

        isRequiredInvalid(fieldValue) {
            return (
                fieldValue === undefined ||
                fieldValue === null ||
                (typeof fieldValue === "string" && fieldValue.trim() === "")
            );
        }

        isMaxLengthInvalid(fieldValue, rule) {
            const maxLength = parseInt(rule.split("-")[1]);
            return fieldValue && fieldValue.length > maxLength;
        }

        isMinLengthInvalid(fieldValue, rule) {
            const minLength = parseInt(rule.split("-")[1]);
            return fieldValue && fieldValue.length < minLength;
        }

        isLangInvalid(fieldValue, rule) {
            const lang = rule.split("-")[1];
            if (lang === "en") {
                return /[^a-zA-Z\s]/.test(fieldValue); // Checks for non-English characters
            } else if (lang === "ar") {
                return /[^\u0600-\u06FF\s]/.test(fieldValue); // Checks for non-Arabic characters
            }
            return false; // No invalid characters for unsupported or undefined languages
        }

        isNumberInvalid(fieldValue) {
            return isNaN(fieldValue);
        }

        isTextInvalid(fieldValue) {
            if (typeof fieldValue !== "string" || fieldValue.trim() === "") {
                return true; // Not a string or empty string
            }
            // Check for any characters other than English or Arabic letters and spaces
            if (/[^a-zA-Z\s\u0600-\u06FF]/.test(fieldValue)) {
                return true; // Invalid if it contains any numbers or special characters
            }
            return false; // Valid if it contains only valid characters
        }

        // Email validation method
        isEmailInvalid(fieldValue) {
            if (!fieldValue) return true; // Empty or undefined values are invalid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(fieldValue);
        }

        hasErrors(valueStatus) {
            return Object.values(valueStatus).some(status => status.valueState === "Error");
        }

        isInvalidDate(value) {
            return isNaN(new Date(value).getTime());
        }

        dataRangeValidator(fieldValue, rules) {
            const parts = rules.split("-");
            if (parts[0] !== "zDate" || parts.length < 3) {
                return { valid: true }; // Not a zDate range rule, so consider it valid
            }

            let startDate, endDate;

            // Parse start date
            if (parts[1] === "new") {
                startDate = new Date(); // Current date and time
            } else if (parts[1] === "all") {
                startDate = new Date(-8640000000000000); // Earliest possible date
            } else {
                startDate = new Date(parts[1]); // Parse the provided start date
            }

            // Parse end date
            if (parts[2] === "new") {
                endDate = new Date(); // Current date and time
            } else if (parts[2] === "all") {
                endDate = new Date(8640000000000000); // Latest possible date
            } else {
                endDate = new Date(parts[2]); // Parse the provided end date
            }

            // Validate start and end dates
            if (this.isInvalidDate(startDate) || this.isInvalidDate(endDate)) {
                return { valid: false, message: "Invalid start or end date in rules." };
            }

            // Parse the field value as a Date object
            const checkDate = new Date(fieldValue);
            // console.log("checkDate", checkDate);

            if (this.isInvalidDate(checkDate)) {
                return { valid: false, message: "Invalid date or time in fieldValue." };
            }

            // Perform the range validation
            const isValid = checkDate >= startDate && checkDate <= endDate;
            return !isValid;
        }

        isRuleGroupInvalid(fieldValue, rule) {
            // Regex to parse both atLessG and atMaxG rules
            const rulePattern = /^(atLessG|atMaxG)(\d+)-(\d+)$/;
            const match = rule.match(rulePattern);

            if (!match) {
                console.error("Invalid rule format:", rule);
                return true; // Consider invalid rules as an error
            }

            const ruleType = match[1]; // "atLessG" or "atMaxG"
            const groupNumber = parseInt(match[2], 10); // Extract group number
            const threshold = parseInt(match[3], 10);   // Extract threshold (min or max)

            // Find all fields matching the group
            const fieldsInGroup = this.findFieldsByAtLessG(`${ruleType}${groupNumber}`);

            // Count how many fields in the group have a value (non-empty or true)
            const validFieldsCount = this.countTrueOrNonEmptyValues(fieldsInGroup);

            // Debugging: Log the counts for better visibility

            // Validate based on the rule type
            if (ruleType === "atLessG") {
                // At least `threshold` fields must have a value
                return validFieldsCount < threshold;
            } else if (ruleType === "atMaxG") {
                // No more than `threshold` fields can have a value
                return validFieldsCount > threshold;
            }

            // Default case: Invalid rule type
            console.error("Unknown rule type:", ruleType);
            return true; // Treat unknown rule types as errors
        }

        // --------------------- Helper ---------------------
        findFieldsByAtLessG(prefix) {
            const result = [];

            // Iterate through the autoG array
            for (const field of this.autoG) {
                // Split the rules string into individual rules
                const rules = field.rules.split("|");

                // Check if any rule starts with the specified prefix
                if (rules.some(rule => rule.startsWith(prefix))) {
                    result.push({ fieldName: field.fieldName, value: this.inputData[field.fieldName] });
                }
            }

            // Return all matching fields (empty array if no matches)
            return result;
        }

        countTrueOrNonEmptyValues(fields) {
            let count = 0;

            // Loop through the array of objects
            for (const field of fields) {
                // Check if the value is true or non-empty
                if (field.value === true || (field.value && field.value.trim())) {
                    count++;
                }
            }

            return count;
        }
    }
});

// const inputData = {
//     emailField: "invalid-email",
//     nameField: "John Doe"
// };

// const autoG = [
//     { fieldName: "emailField", rules: "required|email", cMessage: "Email is required|Please enter a valid email!" },
//     { fieldName: "nameField", rules: "required|min-3", cMessage: "Name is required|Name must be at least 3 characters long!" }
// ];

// const validator = new Validator(null, autoG);
// const validationResults = validator.validate(inputData);

// console.log(validationResults);



// ------------------------- Old Way -------------------------
// Example usage
// const rules = [
//     ["Name", "required|max-23|min-10|lang-en|text"],
//     ["Age", "required|max-3|min-1|number"],
// ];

// const inputData = {
//     Name: "Test123", // Invalid: less than 10 chars and not English-only
//     Age: "25",       // Valid
// };

// const validator = new Validator(rules);
// const valueStatus = validator.validate(inputData);

// console.log(valueStatus);
