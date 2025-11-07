require('colors');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const databases = require('./Models'); // all DBs exported from Models/index.js
const { initializeDatabaseConnection } = require('./DB/DBInit');

const mainRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Use all routers
app.use('/api', mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
    console.log("\n[+] ========== Starting Server & Initializing DBs ========== \n");

    // Initialize all databases exported from Models
    const dbKeys = Object.keys(databases || {});
    for (const key of dbKeys) {
        try {
            const db = databases[key];
            if (!db || !db.sequelize) {
                console.log(`[!] - Skipping ${key}: no sequelize instance found.`.yellow);
                continue;
            }

            console.log(`[~] Initializing ${key}...`.cyan);
            await initializeDatabaseConnection(db.sequelize, key);
            console.log(`[✅] ${key} initialized successfully.`.green);
        } catch (err) {
            // initializeDatabaseConnection may throw after its retries — log and continue
            console.error(`[❌] Failed to initialize ${key}:`.red, err.message || err);
            console.error(err);
        }
    }

    // Start server regardless of DB init status
    app.listen(PORT, () => {
        console.log(`\n🚀 Server is running on port ${PORT}`.bold);
        console.log("\n[+] ========== Server started (DB initialization attempted) ========== \n");
    });
};

startServer().catch(err => {
    console.error("[!] Unhandled error in startServer:".red, err);
    // Still attempt to start the server in case DB init threw unexpectedly
    app.listen(PORT, () => {
        console.log(`\n🚀 Server is running on port ${PORT} (after uncaught init error)`.bold);
    });
});
