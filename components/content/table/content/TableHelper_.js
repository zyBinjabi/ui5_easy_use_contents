sap.ui.define([], function () {
    "use strict";

    return class TableHelper {
        constructor(controller, dataKeySuffix = "") {
            this._controller = controller;
            this._dialogCache = {};  // Local cache for dialogs
            this.tableId = null;
            this.isDefaultGroup = false;

            // Function name on controller to call for getting data
            this.getDataFuncName = `getDataXkeysAItems${dataKeySuffix}`; // getDataXkeysAItems undefined
        }

        setTableId(tableId) {
            this.tableId = tableId;
        }

        /**
         * Extracts data and metadata (binding paths and items) from the table.
         */
        getDataXkeysAItems(event, modelNameOverride = '', customLabels = [], extraPaths = []) {
            const modelName = modelNameOverride || this._controller.mainTableModel;
            const modelData = this._controller.getView()?.getModel(modelName)?.getData();

            if (!modelData || !Array.isArray(modelData) || modelData.length === 0) {
                console.warn("TableHelper: No data found in model", modelName);
                return null;
            }

            // Start with any extra paths explicitly passed
            let bindingPaths = [...extraPaths];

            // Traverse parent hierarchy to find the sap.ui.table.Table
            let current = event.getSource()?.getParent();
            while (current) {
                if (current instanceof sap.ui.table.Table) {
                    // Extract binding paths from columns
                    current.getColumns().forEach(col => {
                        const template = col.getTemplate();
                        const bindingInfo = template?.getBindingInfo("text");
                        if (bindingInfo?.parts?.length) {
                            const path = bindingInfo.parts[0].path?.trim();
                            if (path) {
                                bindingPaths.push(path);
                            }
                        }
                    });
                    break;
                }
                current = current.getParent();
            }

            // Clean whitespace and duplicates
            bindingPaths = [...new Set(bindingPaths.map(path => path.replace(/\s+/g, '')))];

            // Prepare items with human-friendly labels
            const items = bindingPaths.map(path => ({
                key: path,
                text: this.camelCaseToLabel(path)
            }));

            // Allow user override for labels
            if (customLabels.length) {
                this.updateItemsLabels(items, customLabels);
            }

            return { data: modelData, xkeys: bindingPaths, aItems: items };
        }

        // ================= SORT =================
        onSearch(event) {
            // Get search query
            var sQuery = event.getParameter("query");
            var oTable = this._controller.byId(this.tableId);
            var oBinding = oTable.getBinding("rows");

            // Clear filters if no query
            if (!sQuery) {
                oBinding.filter([]);
                return;
            }

            // Get data, keys, and items from controller method
            const result = this._controller[this.getDataFuncName]?.(event);
            if (!result) return;

            var data = result.data || [];
            var xkeys = result.xkeys || [];

            if (!xkeys.length || !data.length) {
                oBinding.filter([]);
                return;
            }

            // Build filters
            var aFilters = [];
            var sampleItem = data[0];

            xkeys.forEach(function (key) {
                var value = sampleItem[key];

                if (typeof value === "string") {
                    aFilters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.Contains, sQuery));
                } else if (typeof value === "number") {
                    var numQuery = parseFloat(sQuery);
                    if (!isNaN(numQuery)) {
                        aFilters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, numQuery));
                    }
                } else if (value instanceof Date) {
                    var dateQuery = new Date(sQuery);
                    if (!isNaN(dateQuery.getTime())) {
                        aFilters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, dateQuery));
                    }
                }
                // Extend with more types if needed
            });

            console.log("aFilters: ", aFilters)

            // Apply filters
            if (aFilters.length) {
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false
                });
                oBinding.filter(oCombinedFilter);
            } else {
                oBinding.filter([]);
            }
        }


        // ================= SORT =================
        handleSortButtonPressed(event) {
            console.log("1:", this.getDataFuncName)
            const result = this._controller[this.getDataFuncName]?.(event);
            if (!result) return;
            console.log("2:", event)

            const { aItems } = result;

            const dialogKey = "sort";
            if (!this._dialogCache[dialogKey]) {
                const dialog = new sap.m.ViewSettingsDialog({
                    confirm: this.handleSortDialogConfirm.bind(this)
                });

                aItems.forEach(item =>
                    dialog.addSortItem(new sap.m.ViewSettingsItem({ key: item.key, text: item.text, selected: true }))
                );

                this._dialogCache[dialogKey] = dialog;
            }

            this._dialogCache[dialogKey].open();
        }

        handleSortDialogConfirm(event) {
            const table = this._controller.byId(this.tableId);
            if (!table) {
                console.error("TableHelper: Table not found for ID", this.tableId);
                return;
            }

            const binding = table.getBinding("rows");
            if (!binding) return;

            const params = event.getParameters();
            if (params.sortItem) {
                const sorter = new sap.ui.model.Sorter(params.sortItem.getKey(), params.sortDescending);
                binding.sort([sorter]);
            }
        }

        // ================= FILTER =================
        handleFilterButtonPressed(event) {
            const result = this._controller[this.getDataFuncName]?.(event);
            if (!result) return;

            const { data, aItems } = result;
            const dialogKey = "filter";
            if (!this._dialogCache[dialogKey]) {
                const dialog = new sap.m.ViewSettingsDialog({
                    confirm: this.handleFilterDialogConfirm.bind(this)
                });

                aItems.forEach(item => {
                    const filterItem = new sap.m.ViewSettingsFilterItem({
                        key: item.key,
                        text: item.text,
                        multiSelect: true
                    });

                    // Add distinct values as filter options
                    const uniqueValues = [...new Set(data.map(d => d[item.key]))];
                    uniqueValues.forEach(val => {
                        if (val !== undefined && val !== null) {
                            filterItem.addItem(new sap.m.ViewSettingsItem({ key: val, text: String(val) }));
                        }
                    });

                    dialog.addFilterItem(filterItem);
                });

                this._dialogCache[dialogKey] = dialog;
            }

            this._dialogCache[dialogKey].open();
        }

        handleFilterDialogConfirm(event) {
            const table = this._controller.byId(this.tableId);
            if (!table) {
                console.error("TableHelper: Table not found for ID", this.tableId);
                return;
            }

            const binding = table.getBinding("rows");
            if (!binding) return;

            const filters = event.getParameters().filterItems.map(item =>
                new sap.ui.model.Filter(item.getKey(), sap.ui.model.FilterOperator.EQ, item.getText())
            );

            binding.filter(filters);
        }

        // ================= GROUP =================
        handleGroupButtonPressed(event) {
            const result = this._controller[this.getDataFuncName]?.(event);
            if (!result) return;

            const { aItems } = result;
            const dialogKey = "group";

            if (!this._dialogCache[dialogKey]) {
                const dialog = new sap.m.ViewSettingsDialog({
                    confirm: ev => this.handleGroupDialogConfirm(ev, event),
                    reset: this.resetGroupDialog.bind(this)
                });

                aItems.forEach(item =>
                    dialog.addGroupItem(new sap.m.ViewSettingsItem({ key: item.key, text: item.text }))
                );

                if (this.isDefaultGroup && aItems.length) {
                    dialog.setSelectedGroupItem(aItems[0].key);
                }

                this._dialogCache[dialogKey] = dialog;
            }

            this._dialogCache[dialogKey].open();
        }

        handleGroupDialogConfirm(event, originalEvent) {
            const table = this._controller.byId(this.tableId);
            if (!table) {
                console.error("TableHelper: Table not found for ID", this.tableId);
                return;
            }

            const binding = table.getBinding("rows");
            if (!binding) return;

            this.generateGroupFunctions(originalEvent);

            const params = event.getParameters();
            const groupFunc = this.mGroupFunctions?.[params.groupItem?.getKey()];
            if (groupFunc) {
                const sorter = new sap.ui.model.Sorter(params.groupItem.getKey(), params.groupDescending, groupFunc);
                binding.sort([sorter]);
            }
        }

        resetGroupDialog() {
            this._dialogCache["group"] = null;
        }

        /**
         * Generates the grouping functions.
         * This is your hook to define custom logic.
         */
        generateGroupFunctions(event) {
            this.mGroupFunctions = {};

            const result = this._controller[this.getDataFuncName]?.(event);
            if (!result) return;

            result.aItems.forEach(item => {
                this.mGroupFunctions[item.key] = (context) => {
                    const value = context.getProperty(item.key);
                    return {
                        key: value,
                        text: `${item.text}: ${value}`
                    };
                };
            });
        }

        /**
         * Converts a camelCase string to a normal label (e.g., "userName" -> "User Name")
         */
        camelCaseToLabel(camelCase) {
            if (!camelCase) return "";
            return camelCase
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, str => str.toUpperCase())
                .trim();
        }

        /**
         * Updates items' text with provided custom labels.
         */
        updateItemsLabels(items, customLabels) {
            customLabels.forEach(label => {
                const item = items.find(i => i.key === label.key);
                if (item) {
                    item.text = label.text;
                }
            });
        }
    };
});
