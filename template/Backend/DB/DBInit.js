const colors = require('colors');

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 5;

async function initializeDatabaseConnection(sequelize, name = 'Database') {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            await sequelize.authenticate();
            console.log(`[✅] - ${name} connection established.`.green);
            await sequelize.sync();
            return true;
        } catch (error) {
            console.error(`\n[!] ${name} connection failed: ${error.message}\n`.red);
            retries++;
            if (retries >= MAX_RETRIES) {
                console.error(`\n[❌] ${name} could not connect after ${MAX_RETRIES} attempts.\n`.bgRed.white);
                throw error;
            }
            console.log(`\n[↻] Retrying ${name} in ${RETRY_DELAY_MS / 1000} seconds...\n`.yellow);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
        }
    }
}

module.exports = { initializeDatabaseConnection };
