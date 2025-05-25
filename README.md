

# ez5 🚀 – UI5 App Generator

**ez5** is an auto-generating UI5 package that helps you build UI5 applications faster and smarter by automating tedious setup processes and providing out-of-the-box utilities.

---

## ✨ Features

### 🔧 Init App

- **Main Structure**: Defines the overall app layout and routing logic.
- **Side Navigation + Home Page**: Built-in navigation with a tail section on the home page.
- **i18n + Dark Mode Toggle**: Easily switch languages and toggle between dark/light themes.
- **Restricted Page Access**: Control user access to pages based on their roles.

### ➕ Add Page

- Add new pages easily.
- Automatically registers new pages into `manifest.json` and `navList.json`.
- Instantly available in the side navigation menu.

### 📦 Insert Components

| Component | Description |
|----------|-------------|
| **Form**  | Generates a form with validation, error display, and data binding. |
| **Table** | Adds a searchable, filterable, sortable table. |
| **Chart** | *(Coming Soon)* Interactive charts for your dashboards. |

### 🌐 Translate (i18n)

- Binds text for multi-language support.
- Includes a language switcher with simple configuration.

---

## 📥 Installation

Run the CLI tool to configure the package:

```bash
npm install ui5_easy_use
node node_modules/ui5_easy_use/auto_add_json.js
npm run ez5
````

You will see the following menu:

```
## Init App 🌟
## Add Page 📄
## Insert Components 🧩
## Translate_i18n 🌐
## Exit ❌
```

---

## 🚀 Usage Guide

### 1️⃣ Init App

> Defines base setup and enables routing and page access control.

* **Routing Options**:

  * `f.route`: Flexible column layout (3-layout structure)
  * `m.route`: Standard routing

* **Access Control**:

  * **Define User Roles** in `webapp/ez5/helper/Env.js`
  * **Assign Page Roles** in `webapp/model/rulesNavList.json`
  * Classes Involved:

    * `UserModel.js`
    * `AuthService.js`
    * `AccessControl.js`
    * `PagesAccess.js`

* **Overwritten Files**:

  * `Component.js`, `App.view.xml`, `App.controller.js`, etc.

* **New Files Added**:

  * `SideNavigation.fragment.xml`, `navList.json`, `rulesNavList.json`, etc.

### 2️⃣ Add Page

> Quickly add new pages with proper routing.

* **Templates**:

  * Located at: `webapp/ez5/pagemt/`
  * Supports: `Normal`, `Details`, `Details_details` layouts
* **Routing Type**:

  * `m.route`: Basic single-page setup
  * `f.route`: Supports nested views (List, Details, Sub-details)

### 3️⃣ Insert Components

#### 📄 Form

* **Location**: `webapp/ez5/Components/form`
* **Steps**:

  1. Select Controller → Update `this.autoG` inside `initialForm`
  2. Select View → Form auto-generated

#### 📊 Table

* **Location**: `webapp/ez5/Components/table`
* **Steps**:

  1. Select Controller → Update `this.autoG` inside `initialTable`
  2. Select View → Table auto-generated

### 4️⃣ Translate i18n

* **Instructions**:

  * Use spacebar to select, `a` to toggle all, `i` to invert, and Enter to proceed.
  * Select target folder → i18n bindings added automatically.

---

## 📂 Folder Structure Highlights

```plaintext
webapp/
├── ez5/
│   ├── initapp/
│   ├── Components/
│   │   ├── form/
│   │   └── table/
│   ├── auth/
│   └── pagemt/
├── model/
│   ├── navList.json
│   └── rulesNavList.json
```

---

## 🔐 Role-Based Access Sample

```js
// webapp/model/rulesNavList.json
{
  "AdminPage": ["adminAccess"],
  "UserDashboard": ["normalAccess", "adminAccess"]
}

// webapp/ez5/helper/Env.js
roles = ["normal", "admin"]

// webapp/ez5/auth/AccessControl.js
roleMatrix = {
  normalAccess: ["normal", "admin"],
  adminAccess: ["admin"]
}
```

---

## 🧠 Notes

* Fully extensible and customizable.
* Works great for enterprise-ready Fiori apps.
* Ideal for both small projects and large-scale systems.

---

## 🛠 Maintainers

Developed and maintained with ❤️ by the [ez5 contributors](https://github.com/zyBinjabi/ui5_easy_use).

---

## 📃 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more info.
