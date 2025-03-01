// =================IMPORTS START======================//
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import csurf from 'csurf';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { NODE_ENV, DB_PORT } from './config/config-module.ts';
// import routes from './routes';
import { ValidationError } from 'sequelize';
import router from '@routes/routes';
import logger from '@utils/logger';

import { SEQUALIZE_DB } from '@database/sequelize-db.ts';


import { errorHandler } from './utils/error-handler';
import { swaggerSpec, swaggerUi } from './utils/swagger';



// =================VARIABLES START======================//


const isProduction = (NODE_ENV === 'production');
const isDevelopment = (NODE_ENV === 'development');
const isTesting = (NODE_ENV === 'testing');

const SERVER = express();
const port = DB_PORT;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};


// =================MIDDLE WARE START======================//


// morgan and cookieParser
SERVER.use(morgan('dev'));
SERVER.use(cookieParser());


// Enable CORS if not production
if (!isProduction) {
    SERVER.use(cors(corsOptions));
    SERVER.options('*', cors(corsOptions));
}


// helmet and csurf
SERVER.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
SERVER.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);


// routes
SERVER.use(routes);


// Middleware for parsing JSON and URL-encoded bodies
SERVER.use(express.json());
SERVER.use(express.urlencoded({ extended: true }));

SERVER.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Use the router with the /api prefix
SERVER.use('/api', router);
SERVER.use(errorHandler);

SERVER.all('*', (req, res) => {
    res.status(404).json({ message: 'Sorry! Page not found' });
});




// =================ROUTES START======================//


SERVER.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
});






SERVER.use((_req, _res, next) => {
    const err: any = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

SERVER.use((err: any, _req, _res, next) => {
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

SERVER.use((err: any, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'SERVER Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});




export default SERVER;
