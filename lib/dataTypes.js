// Data type mappings for different SQL dialects
const dataTypesByDialect = {
    mysql: [
        { name: 'INTEGER', needsLength: false, description: 'Whole number' },
        { name: 'BIGINT', needsLength: false, description: 'Large whole number' },
        { name: 'FLOAT', needsLength: false, description: 'Floating point number' },
        { name: 'DOUBLE', needsLength: false, description: 'Double precision number' },
        { name: 'DECIMAL', needsLength: true, description: 'Exact decimal (e.g., 10,2 for currency)' },
        { name: 'STRING', needsLength: true, description: 'Variable length string (VARCHAR)' },
        { name: 'TEXT', needsLength: false, description: 'Long text' },
        { name: 'BOOLEAN', needsLength: false, description: 'True/False' },
        { name: 'DATE', needsLength: false, description: 'Date only' },
        { name: 'DATETIME', needsLength: false, description: 'Date and time' },
        { name: 'TIME', needsLength: false, description: 'Time only' },
        { name: 'JSON', needsLength: false, description: 'JSON data' },
        { name: 'BLOB', needsLength: false, description: 'Binary data' },
        { name: 'ENUM', needsLength: false, description: 'Enumeration (list of values)' }
    ],
    mariadb: [
        { name: 'INTEGER', needsLength: false, description: 'Whole number' },
        { name: 'BIGINT', needsLength: false, description: 'Large whole number' },
        { name: 'FLOAT', needsLength: false, description: 'Floating point number' },
        { name: 'DOUBLE', needsLength: false, description: 'Double precision number' },
        { name: 'DECIMAL', needsLength: true, description: 'Exact decimal (e.g., 10,2 for currency)' },
        { name: 'STRING', needsLength: true, description: 'Variable length string (VARCHAR)' },
        { name: 'TEXT', needsLength: false, description: 'Long text' },
        { name: 'BOOLEAN', needsLength: false, description: 'True/False' },
        { name: 'DATE', needsLength: false, description: 'Date only' },
        { name: 'DATETIME', needsLength: false, description: 'Date and time' },
        { name: 'TIME', needsLength: false, description: 'Time only' },
        { name: 'JSON', needsLength: false, description: 'JSON data' },
        { name: 'BLOB', needsLength: false, description: 'Binary data' },
        { name: 'ENUM', needsLength: false, description: 'Enumeration (list of values)' }
    ],
    postgres: [
        { name: 'INTEGER', needsLength: false, description: 'Whole number' },
        { name: 'BIGINT', needsLength: false, description: 'Large whole number' },
        { name: 'FLOAT', needsLength: false, description: 'Floating point number' },
        { name: 'DOUBLE', needsLength: false, description: 'Double precision number' },
        { name: 'DECIMAL', needsLength: true, description: 'Exact decimal (e.g., 10,2 for currency)' },
        { name: 'STRING', needsLength: true, description: 'Variable length string (VARCHAR)' },
        { name: 'TEXT', needsLength: false, description: 'Long text' },
        { name: 'BOOLEAN', needsLength: false, description: 'True/False' },
        { name: 'DATE', needsLength: false, description: 'Date only' },
        { name: 'TIMESTAMP', needsLength: false, description: 'Date and time with timezone' },
        { name: 'TIME', needsLength: false, description: 'Time only' },
        { name: 'JSONB', needsLength: false, description: 'Binary JSON data (recommended)' },
        { name: 'JSON', needsLength: false, description: 'JSON data' },
        { name: 'BYTEA', needsLength: false, description: 'Binary data' },
        { name: 'UUID', needsLength: false, description: 'Universally unique identifier' },
        { name: 'ARRAY', needsLength: false, description: 'Array of values' },
        { name: 'ENUM', needsLength: false, description: 'Enumeration (list of values)' }
    ]
};

function getDataTypesForDialect(dialect) {
    return dataTypesByDialect[dialect] || dataTypesByDialect.mysql;
}

function getDataTypeChoices(dialect) {
    const types = getDataTypesForDialect(dialect);
    return types.map(t => ({
        name: `${t.name} - ${t.description}`,
        value: t.name,
        short: t.name
    }));
}

function needsLength(dialect, dataType) {
    const types = getDataTypesForDialect(dialect);
    const type = types.find(t => t.name === dataType);
    return type ? type.needsLength : false;
}

module.exports = {
    getDataTypesForDialect,
    getDataTypeChoices,
    needsLength
};
