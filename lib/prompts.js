const inquirer = require("inquirer");
const { getDataTypeChoices, needsLength } = require('./dataTypes');

module.exports.mainPrompts = () => {
    return inquirer.prompt([
        {
            name: 'projectName',
            message: 'Project name',
            default: 'my-fullstack-app',
            validate: (input) => {
                if (!input || input.trim().length === 0) {
                    return 'Project name cannot be empty';
                }
                if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
                    return 'Project name can only contain letters, numbers, hyphens, and underscores';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'dbDialect',
            message: 'Main DB Dialect:',
            choices: ['mysql', 'mariadb', 'postgres']
        },
        {
            type: 'confirm',
            name: 'addExtraDB',
            message: 'Add an extra database connection?',
            default: false
        },
        {
            type: 'confirm',
            name: 'initGit',
            message: 'Initialize Git repository?',
            default: false
        },
        {
            name: 'remoteRepo',
            message: 'Enter remote Git repository URL:',
            when: (answers) => answers.initGit === true,
            validate: (input) => input.length > 0 ? true : "This field cannot be empty."
        }
    ]);
};

module.exports.extraDBPrompts = async () => {
    const basicInfo = await inquirer.prompt([
        {
            name: 'dbKey',
            message: 'DB Identifier (e.g., REPORTING_DB):',
            validate: (input) => {
                if (!input || input.trim().length === 0) {
                    return 'DB identifier cannot be empty';
                }
                if (!/^[A-Z][A-Z0-9_]*$/.test(input)) {
                    return 'DB identifier should be UPPERCASE with underscores (e.g., MY_DB)';
                }
                return true;
            }
        },
        { name: 'database', message: 'DB Name:', validate: (input) => input.trim().length > 0 ? true : 'Cannot be empty' },
        { name: 'username', message: 'DB Username:', validate: (input) => input.trim().length > 0 ? true : 'Cannot be empty' },
        { name: 'password', message: 'DB Password:' },
        { name: 'host', message: 'DB Host:', default: 'localhost' },
        {
            name: 'port',
            message: 'DB Port:',
            default: '3306',
            validate: (input) => {
                const port = parseInt(input);
                if (isNaN(port) || port < 1 || port > 65535) {
                    return 'Please enter a valid port number (1-65535)';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'dialect',
            message: 'DB Dialect:',
            choices: ['mysql', 'mariadb', 'postgres']
        },
        {
            name: 'tableName',
            message: 'Model / Table Name:',
            default: 'sample_table',
            validate: (input) => {
                if (!input || input.trim().length === 0) {
                    return 'Table name cannot be empty';
                }
                if (!/^[a-z][a-z0-9_]*$/.test(input)) {
                    return 'Table name should be lowercase with underscores (e.g., user_profiles)';
                }
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'defineAttributes',
            message: 'Do you want to define table attributes now?',
            default: false
        }
    ]);

    // If user wants to define attributes, collect them
    if (basicInfo.defineAttributes) {
        basicInfo.attributes = await collectTableAttributes(basicInfo.dialect);
    }

    return basicInfo;
};

async function collectTableAttributes(dialect) {
    const attributes = [];

    console.log('\n📋 Define table attributes. Start with the primary key.\n');

    // Primary key first
    const pkAnswers = await inquirer.prompt([
        {
            name: 'name',
            message: 'Primary key column name:',
            default: 'id',
            validate: (input) => {
                if (!input || input.trim().length === 0) return 'Column name cannot be empty';
                if (!/^[a-z][a-z0-9_]*$/.test(input)) return 'Use lowercase with underscores';
                return true;
            }
        },
        {
            type: 'list',
            name: 'type',
            message: 'Primary key data type:',
            choices: ['INTEGER', 'BIGINT', 'UUID', 'STRING'],
            default: 'INTEGER'
        },
        {
            type: 'confirm',
            name: 'autoIncrement',
            message: 'Auto-increment?',
            default: true,
            when: (answers) => answers.type === 'INTEGER' || answers.type === 'BIGINT'
        }
    ]);

    attributes.push({
        name: pkAnswers.name,
        type: pkAnswers.type,
        primaryKey: true,
        autoIncrement: pkAnswers.autoIncrement || false,
        allowNull: false
    });

    console.log('\n✅ Primary key added. Now add other attributes.\n');

    // Collect other attributes
    let addMore = true;
    while (addMore) {
        const attrAnswers = await inquirer.prompt([
            {
                name: 'name',
                message: 'Column name:',
                validate: (input) => {
                    if (!input || input.trim().length === 0) return 'Column name cannot be empty';
                    if (!/^[a-z][a-z0-9_]*$/.test(input)) return 'Use lowercase with underscores';
                    if (attributes.find(a => a.name === input)) return 'Column name already exists';
                    return true;
                }
            },
            {
                type: 'list',
                name: 'type',
                message: 'Data type:',
                choices: getDataTypeChoices(dialect)
            }
        ]);

        // Ask for length if needed
        if (needsLength(dialect, attrAnswers.type)) {
            const lengthAnswer = await inquirer.prompt([
                {
                    name: 'length',
                    message: `Length/Precision for ${attrAnswers.type}:`,
                    default: attrAnswers.type === 'STRING' ? '255' : '10,2',
                    validate: (input) => {
                        if (!input || input.trim().length === 0) return 'Length cannot be empty';
                        return true;
                    }
                }
            ]);
            attrAnswers.length = lengthAnswer.length;
        }

        // Ask for constraints
        const constraints = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'allowNull',
                message: 'Allow NULL values?',
                default: true
            },
            {
                type: 'confirm',
                name: 'unique',
                message: 'Should this be unique?',
                default: false
            },
            {
                type: 'confirm',
                name: 'hasDefault',
                message: 'Set a default value?',
                default: false
            }
        ]);

        if (constraints.hasDefault) {
            const defaultAnswer = await inquirer.prompt([
                {
                    name: 'defaultValue',
                    message: 'Default value:',
                    validate: (input) => input !== undefined && input !== '' ? true : 'Provide a default value'
                }
            ]);
            attrAnswers.defaultValue = defaultAnswer.defaultValue;
        }

        attributes.push({
            name: attrAnswers.name,
            type: attrAnswers.type,
            length: attrAnswers.length,
            allowNull: constraints.allowNull,
            unique: constraints.unique,
            defaultValue: attrAnswers.defaultValue
        });

        const continueAnswer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'addMore',
                message: 'Add another attribute?',
                default: true
            }
        ]);

        addMore = continueAnswer.addMore;
    }

    console.log(`\n✅ Added ${attributes.length} attributes to the model.\n`);
    return attributes;
}

module.exports.routePrompts = () => {
    return inquirer.prompt([
        {
            name: 'routeName',
            message: 'Route name (e.g., users, products):',
            validate: (input) => {
                if (!input || input.trim().length === 0) {
                    return 'Route name cannot be empty';
                }
                if (!/^[a-z][a-z0-9_]*$/.test(input)) {
                    return 'Route name should be lowercase with underscores (e.g., user_profiles)';
                }
                return true;
            }
        },
        {
            name: 'routePath',
            message: 'Route path (e.g., /users):',
            default: (answers) => `/${answers.routeName}`,
            validate: (input) => {
                if (!input || input.trim().length === 0) {
                    return 'Route path cannot be empty';
                }
                if (!input.startsWith('/')) {
                    return 'Route path should start with /';
                }
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'needsAuth',
            message: 'Does this route require authentication?',
            default: true
        }
    ]);
};
