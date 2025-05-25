// main.js for components/Table
// main.js for components/Form

const chalk = require('chalk');
const { console } = require('inspector');
const path = require('path'); // Import the 'path' module for cross-platform path handling

const table_menu = {
    message: '\n-----------\nSelect Action',
    parent: 'main_components', // Allows navigating back to the main menu
    choices: [
        {
            name: 'Select The Controller:',
            value: 'insertTableJs',
            handler: async (context) => {
                // console.log(chalk.blue('🚀') + chalk.yellow(' Coming Soon...') + chalk.green(' 🔜'));
                // Update the JS
                // Define the list of options
                const optionsAPI = ['1- odataV4', '2- none'];


                const logger = new context.Logger();
                const helper = new context.Helper();
                const selectedPathsXML = await helper.handlerGetPaths(context);

                if (!selectedPathsXML.length) {
                    logger.warn('You did not select any paths. Please think and try again.');
                    return;
                }

                console.log(chalk.blue('Selected Paths:'));

                selectedPathsXML.forEach((path, index) => {
                    console.log(chalk.green(`${index + 1}: ${path}`));
                });

                const confirm = await context.cliHandler.confirm('Do you want to proceed with these paths?');
                if (!confirm) {
                    return;
                }


                for (const selectedPathXML of selectedPathsXML) {
                    if (selectedPathXML.endsWith('.js')) {
                        context.uI5JSHandler.syncFiles("components/table/content/ex_Table.js", selectedPathXML);

                        // Extract the page name (first word before the '.') in a cross-platform way
                        const fileName = path.basename(selectedPathXML, '.js'); // Get the file name without extension
                        const pageName = fileName.split('.')[0]; // Extract the first word before the '.'

                        context.fileHandler.replacePlaceholdersInFile(selectedPathXML, {
                            appName: context.constant.appName,
                            packgName: context.constant.packgName,
                            controllerName: pageName,
                        });

                        const apiIntegration = await context.cliHandler.displayList(optionsAPI, 'Select API Integration?');
                        if (!apiIntegration) {
                            continue;
                        }

                        // process the api integration: odataV4 or localstorage
                        if (apiIntegration === '1- odataV4') {
                            context.uI5JSHandler.syncFiles("api/content/ex_OdataV4.js", selectedPathXML);

                        } else if (apiIntegration === '2- localstorage') {
                            // context.fileHandler.replacePlaceholdersInFile(selectedPathXML, {
                            //     apiIntegration: apiIntegration,
                            // });
                        }

                        context.fileHandler.replacePlaceholdersInFile(selectedPathXML, {
                            appName: context.constant.appName,
                            packgName: context.constant.packgName,
                            controllerName: pageName,
                        });

                    }
                }



                // // 1- Language.js
                // const xmlString = context.fileHandlerSource.readFile('i18n/content/Language.js')
                // const strXML = context.fileHandler.readFile('view/App.view.xml')

                // const newxml = xMLManager.setTagWithChilds(sourceParser.getTagByName('OverflowToolbarButton'), "mvc:View > App > tnt:ToolPage > tnt:header > tnt:ToolHeader > OverflowToolbarButton")
                // context.fileHandler.writeFileWithFolders('view/App.view.xml', newxml)


                // // 2- Component.js
                // const uI5JSHandler = new context.UI5JSHandler(context.fileHandlerSource, context.fileHandler, context.Logger);
                // uI5JSHandler.syncFiles("i18n/content/ex_Commponet.js", "/Component.js")

            }
        },
        {
            name: 'Select the view:',
            value: 'insertTableXML',
            handler: async (context) => {
                const logger = new context.Logger(true);
                const helper = new context.Helper();

                const selectedPathsXML = await helper.handlerGetPaths(context);
                if (!selectedPathsXML.length) {
                    logger.warn('You did not select any paths. Please think and try again.');
                    return;
                }

                console.log(chalk.blue('Selected Paths:'));

                selectedPathsXML.forEach((path, index) => {
                    console.log(chalk.green(`${index + 1}: ${path}`));
                });

                const confirm = await context.cliHandler.confirm('Do you want to proceed with these paths?');
                if (!confirm) {
                    return;
                }

                const sourceXML = context.fileHandlerSource.readFile('components/table/content/ex_Table.xml')

                for (const selectedPathXML of selectedPathsXML) {
                    if (selectedPathXML.endsWith('.xml')) {
                        // Extract the page name (first word before the '.') in a cross-platTable way
                        const fileName = path.basename(selectedPathXML, '.xml'); // Get the file name without extension
                        const pageName = fileName.split('.')[0]; // Extract the first word before the '.'

                        // const destinationXML = context.fileHandler.readFile('view/TestJS.view.xml')
                        const destinationXML = context.fileHandler.readFile(selectedPathXML)

                        const xmlManager = new context.XMLManager(sourceXML, destinationXML);

                        let queryTag = "mvc:View > VBox > table:Table > table:columns > table:Column"
                        const firstStepOnInsert = xmlManager.firstStepOnInsert(logger, queryTag)
                        // logger.info("firstStepOnInsert", firstStepOnInsert.withOutTableElements)

                        // { get the ((this.autoG)) from the controller 
                        const extractedVariable = context.uI5JSHandler.extractVariableFromFunction(
                            `controller/${pageName}.controller.js`, // Source file path
                            'initialTable',                   // Function name 
                            'this.autoG'                     // Variable name (default: "this.autoG")
                        );
                        if (!extractedVariable) {
                            logger.error(`Failed to extract variable from controller/${pageName}.controller.js`, pageName);
                            return;
                        }
                        const parsedValue = context.uI5JSHandler.getParsedValue(extractedVariable.value);
                        // logger.info("parsedValue", parsedValue)
                        // }
                        let newTableElementsTag = xmlManager.generateTableColumnsWithTemplate(firstStepOnInsert.TagContainer, parsedValue)
                        // logger.success("newTableElementsTag", newTableElementsTag)

                        let queryTag2 = "mvc:View > VBox > table:Table > table:columns"
                        let finalXMLSource = xmlManager.thirdStepOnInsert(logger, newTableElementsTag, queryTag2)
                        // logger.success("finalXMLSource", finalXMLSource)

                        //------ Last Step ------
                        const xmlManager2 = new context.XMLManager(finalXMLSource, destinationXML);
                        const finalXML = xmlManager2.insertSourceXMLToDestinationXML(logger)
                        // logger.success("finalXML", finalXML)
                        context.fileHandler.writeFileWithFolders(selectedPathXML, finalXML)


                        context.fileHandler.replacePlaceholdersInFile(selectedPathXML, {
                            appName: context.constant.appName,
                            packgName: context.constant.packgName,
                            controllerName: pageName,
                        });

                    }
                }

            }
        }

    ]
};


const componentsAll = {
    table_menu
}

module.exports = componentsAll;


