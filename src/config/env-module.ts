// This is one of two config files that do essentially the same thing
// This does it using ES Modules for anything in the app that needs it in ES Modules
// This is a config file for node?
// This file imports information from a .env via the config() function that is part of the dotenv library
// The file exports an object with keys that define paths for node to use

// You have to set the environment in terminal before running the application:
// export NODE_ENV=development

import { config } from 'dotenv';
// import config from dotenv library

config({ path: `.env.${process.env.NODE_ENV || 'development'}`});



// The two export statements in the file are used to logically group and export environment variables for different purposes (application configuration and database configuration).
// This pattern improves readability, maintainability, and reusability of the code.
// These exports simultaneously destructure the variables

export const {
    API_PORT,
    NODE_ENV,
    BASE_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
} = process.env;


export const {
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_DIALECT,
} = process.env;
