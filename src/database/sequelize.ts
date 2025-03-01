// This file is setting up and configuring a sequelize instance for connecting to a postgresql database
// It also defines a database model (Users)
// It exports the sequelize instance and models for use in other parts of the application

import logger from '@/utils/logger'; // A custom logger utility for logging database queries and other information.
import Sequelize from 'sequelize'; // The Sequelize library for interacting with the database.
import userModel from './models/user.model'; // A function that defines the Users model (likely located in ./models/user.model).
import { // importing environment variables from src/config/index.ts
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '@/config'; // the @ is an import alias that helps not to write long relative paths. the ts config must be set up to use these

const SEQUELIZE = new Sequelize.Sequelize( // creates new instance of sequelize using the constructor
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
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
        },
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(time + 'ms' + ' ' + query);
        },
        benchmark: true,
    },
);

sequelize.authenticate();

export SEQUELIZE
