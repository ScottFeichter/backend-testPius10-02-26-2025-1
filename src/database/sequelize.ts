// This file is setting up and configuring a sequelize instance for connecting to a postgresql database
// It also defines a database model (Users)
// It exports the sequelize instance and models for use in other parts of the application

import logger from '@/utils/logger'; // A custom logger utility for logging database queries and other information.
import { Sequelize, Dialect } from 'sequelize'; // The Sequelize library for interacting with the database.
import userModel from './models/user.model'; // A function that defines the Users model (likely located in ./models/user.model).
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '../config/env-module.js'; // the @ is an import alias that helps not to write long relative paths. the ts config must be set up to use these

const SEQUELIZE = new Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Dialect) || 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: '-07:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
            acquire: 30000, // optional: timeout for acquiring connection (30 secs)
            idle: 10000, // optional: maximum time a connection can be idle (10 secs)
        },
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(`[${time}ms] ${query}`); // slightly cleaner string interpolation
        },
        benchmark: true,

        // optional: connection retry settings
        retry: {
            max: 3, // maximum number of retry attempts
            timeout: 5000, // timeout before a retry attempt in milliseconds
            backoffJitter: 1000, // random delay between retries in milliseconds
        },
    },
);

export default SEQUELIZE;
