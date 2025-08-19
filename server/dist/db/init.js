"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.testConnection = testConnection;
exports.closeConnection = closeConnection;
const config_1 = __importDefault(require("./config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        // Read the SQL initialization script
        const sqlPath = path_1.default.join(__dirname, 'init.sql');
        const sqlScript = fs_1.default.readFileSync(sqlPath, 'utf8');
        // Execute the SQL script
        await config_1.default.query(sqlScript);
        console.log('Database initialized successfully!');
        console.log('Users table created with all necessary indexes and triggers.');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}
async function testConnection() {
    try {
        const result = await config_1.default.query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0]);
        return true;
    }
    catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}
async function closeConnection() {
    await config_1.default.end();
    console.log('Database connection closed.');
}
// Run initialization if this file is executed directly
if (require.main === module) {
    (async () => {
        try {
            await testConnection();
            await initializeDatabase();
        }
        catch (error) {
            console.error('Initialization failed:', error);
            process.exit(1);
        }
        finally {
            await closeConnection();
        }
    })();
}
