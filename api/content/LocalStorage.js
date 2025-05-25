sap.ui.define([], function () {
    "use strict";

    return class LocalStorage {
        constructor(_controllerJS) {
            this._controllerJS = _controllerJS;
        }

        /**
         * Save data to local storage.
         * @param {string} key - The key under which the data will be stored.
         * @param {*} newData - The data to save (can be an object, array, or primitive).
         */
        saveToLocalStorage(key, newData) {
            if (!key) {
                console.error("Key cannot be empty or null.");
                return;
            }

            try {
                const existingData = this.getFromLocalStorage(key);
                let updatedData;

                if (Array.isArray(existingData)) {
                    updatedData = [...existingData, newData];
                } else if (typeof existingData === 'object' && existingData !== null) {
                    updatedData = { ...existingData, ...newData };
                } else {
                    updatedData = Array.isArray(newData) ? [newData] : newData;
                }

                window.localStorage.setItem(key, JSON.stringify(updatedData));
                console.debug(`Data saved successfully for key: ${key}`); // Use debug instead of log
            } catch (error) {
                console.error(`Error saving data to local storage for key "${key}":`, error); // Log the entire error object
                throw error; // Re-throw the error to allow calling functions to handle it
            }
        }

        /**
         * Retrieve data from local storage.
         * @param {string} key - The key for which to retrieve data.
         * @returns {*} - The retrieved data (or null if no data exists).
         */
        getFromLocalStorage(key) {
            if (!key) {
                console.error("Key cannot be empty or null.");
                return null;
            }

            try {
                const storedData = window.localStorage.getItem(key);

                if (!storedData) {
                    return null;
                }

                return JSON.parse(storedData);
            } catch (error) {
                console.error(`Error retrieving data from local storage for key "${key}":`, error); // Log the entire error object
                return null;
            }
        }

        /**
         * Remove data from local storage by key.
         * @param {string} key - The key to remove from local storage.
         */
        removeFromLocalStorage(key) {
            if (!key) {
                console.error("Key cannot be empty or null.");
                return;
            }

            try {
                window.localStorage.removeItem(key);
                console.debug(`Data removed successfully for key: ${key}`); // Use debug instead of log
            } catch (error) {
                console.error(`Error removing data from local storage for key "${key}":`, error); // Log the entire error object
            }
        }


        /**
         * Clear all data from local storage.
         */
        clearLocalStorage() {
            try {
                window.localStorage.clear();
                console.debug('Local storage cleared successfully.'); // Use debug instead of log
            } catch (error) {
                console.error('Error clearing local storage:', error); // Log the entire error object
            }
        }
    };
});