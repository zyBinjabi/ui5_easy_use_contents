sap.ui.define(
  [
    "${ez5.appName}/${ez5.packgName}/components/table/TableHelper_",
    "${ez5.appName}/${ez5.packgName}/components/Helper",

  ],
  function (TableHelper_, HelperComponents) {
    "use strict";

    return BaseController.extend("${ez5.appName}.controller.${ez5.controllerName}", {
      onInit: function () {
        this.initialTable()
      },

      // ================================== # On Functions # ==================================
      // ==================================  Intial Table
      initialTable: async function () {
        this.tableModel = "${ez5.controllerName}TableModel"
        this.tableId = "${ez5.controllerName}TableId"
        this.helperTableModel = "${ez5.controllerName}helperTableModel";

        this.tableHelper_ = new TableHelper_(this);
        this.tableHelper_.setTableId(this.tableId);

        await this.setTableData();

        this.autoG = [
          { fieldName: "EmployeeId", value: "", type: "Text", rules: "", visible: true, editable: true },
          { fieldName: "EmployeeName", value: "", type: "Text", rules: "", visible: true, editable: true },
          { fieldName: "Country", value: "", type: "Text", rules: "", visible: true, editable: true },
          { fieldName: "Email", value: "", type: "Text", rules: "", visible: true, editable: true },
          { fieldName: "Time", value: "", type: "Text", rules: "", visible: true, editable: true }
        ];

        this.helperComponents = new HelperComponents(this, this.autoG);
        this.helperTableValues = this.helperComponents.extractVisibilityAndEditability();

        this.getView().setModel(new sap.ui.model.json.JSONModel(this.helperTableValues), this.helperTableModel);
      },

      setTableData: async function () {
        this.setBusy(this.tableId, true);

        // API call to get data: Replace this with your own API call
        this.tableData = [
          {
            EmployeeId: 1,
            EmployeeName: "Zaid",
            Country: "Saudi Arabia",
            Email: "zaid@example.com",
            Time: "09:00 AM"
          },
          {
            EmployeeId: 2,
            EmployeeName: "Yazan",
            Country: "Egypt",
            Email: "yazan@example.com",
            Time: "10:30 AM"
          },
          {
            EmployeeId: 3,
            EmployeeName: "Ahmed",
            Country: "Jordan",
            Email: "ahmed@example.com",
            Time: "11:15 AM"
          },
          {
            EmployeeId: 4,
            EmployeeName: "Sara",
            Country: "United Arab Emirates",
            Email: "sara@example.com",
            Time: "01:45 PM"
          },
          {
            EmployeeId: 5,
            EmployeeName: "Lina",
            Country: "Kuwait",
            Email: "lina@example.com",
            Time: "03:00 PM"
          },
          {
            EmployeeId: 6,
            EmployeeName: "Omar",
            Country: "Qatar",
            Email: "omar@example.com",
            Time: "04:20 PM"
          },
          {
            EmployeeId: 7,
            EmployeeName: "Nour",
            Country: "Bahrain",
            Email: "nour@example.com",
            Time: "05:50 PM"
          },
          {
            EmployeeId: 8,
            EmployeeName: "Ali",
            Country: "Oman",
            Email: "ali@example.com",
            Time: "07:00 PM"
          },
          {
            EmployeeId: 9,
            EmployeeName: "Fatima",
            Country: "Lebanon",
            Email: "fatima@example.com",
            Time: "08:30 PM"
          },
          {
            EmployeeId: 10,
            EmployeeName: "Mohammed",
            Country: "Iraq",
            Email: "mohammed@example.com",
            Time: "10:00 PM"
          }
        ];

        this.getView().setModel(new sap.ui.model.json.JSONModel(this.tableData), this.tableModel);
        this.setBusy(this.tableId, false);
      },

      onRefreshTable: async function () {
        await this.setTableData()
        new sap.m.MessageToast.show("Refreshed successfully!");
      },

      // ================================== # Table FSG Functions 
      getDataXkeysAItems: function (ev) {
        let changeTextAItems = [{ key: "Name", text: "Name 2" }]
        return this.tableHelper_.getDataXkeysAItems(ev, this.tableModel, changeTextAItems)
      },
      // ======

      handleSortButtonPressed: function (ev) {
        this.tableHelper_.handleSortButtonPressed(ev)
      },

      handleFilterButtonPressed: function (ev) {
        this.tableHelper_.handleFilterButtonPressed(ev)
      },

      handleGroupButtonPressed: function (ev) {
        this.tableHelper_.handleGroupButtonPressed(ev)

      },

      // ======
      onSearch: function (oEvent) {
        this.tableHelper_.onSearch(oEvent)
      },
      // ======

      handleActionPress: function (ev) {
        const oRow = ev.getParameter("row");
        const oItem = ev.getParameter("item");

        // Check if the row has the binding context for the required model
        const oBindingContext = oRow.getBindingContext(this.tableModel); // replace with your exact model name

        let EmployeeId = oBindingContext.getProperty("EmployeeId"); // Adjust property name as needed
        let EmployeeName = oBindingContext.getProperty("EmployeeName"); // Adjust property name as needed
        new sap.m.MessageToast.show(`You Clicked on Employee Id: ${EmployeeId} - Employee Name: ${EmployeeName}`);

        var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
        var oRouter = this.getOwnerComponent().getRouter();

        oRouter.navTo("${ez5.RouteMyRequests}", { id: EmployeeId, layout: oNextUIState.layout });
      },

      // ================================== # Helper Functions # ==================================
      setBusy: function (id, status) {
        this.getView()?.byId(id)?.setBusy(status);
      },

    });
  }
);
