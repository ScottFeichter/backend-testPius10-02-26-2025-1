
// This is one of two config files that do essentially the same thing
// This does it using common js because sequelizerc needs common js
// This is a config file for sequelize cli via sequelizerc (and anything else in app that needs common js to get env variables)
// The file imports information from a .env via the config() function that is part of the dotenv library
// The file exports an object with keys that define paths for Sequelize CLI to use

// You have to set the environemtn in terminal before running the application:
// export NODE_ENV=development

const { config } = require('dotenv');
// import config from the dotenv library


config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
// Call the config() function passing in an object with property path which is a .env file.
// Which .env file depends on the NODE_ENV.
// If NODE_ENV is not set it defaults to 'development'
// This sets the process.env object with whichever properties the .env file gives it
// For example process.env.DB_HOST which for development would be localhost


const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = process.env;
// Destructure the process.env into variables

module.exports = {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    host: DB_HOST,
    dialect: DB_DIALECT,
    migrationStorageTableName: 'sequelize_migrations',
    seederStorageTableName: 'sequelize_seeds',
};
// Export the variables
// These are imported by sequelizerc
