// =================IMPORTS START======================//
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import csurf from 'csurf';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'sequelize';

// import routes from './routes';
import router from '@routes/routes.js';
import logger from '@utils/logger';
import { errorHandler } from './utils/error-handler';
import { swaggerSpec, swaggerUi } from './utils/swagger';



import { NODE_ENV } from './config/env-module.js';
import SEQUELIZE from '@database/sequelize.js';




// =================VARIABLES START======================//


const IS_PRODUCTION = (NODE_ENV === 'production');
const IS_DEVELOPMENT = (NODE_ENV === 'development');
const IS_TESTING = (NODE_ENV === 'testing');

const SERVER = express();


const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};


// =================MIDDLE WARE START======================//


// morgan and cookieParser
SERVER.use(morgan('dev'));
SERVER.use(cookieParser());


// Enable CORS if not production
if (!IS_PRODUCTION) {
    SERVER.use(cors(corsOptions));
    SERVER.options('*', cors(corsOptions));
}


// helmet and csurf
SERVER.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
SERVER.use(
    csurf({
        cookie: {
            secure: IS_PRODUCTION,
            sameSite: IS_PRODUCTION,
            httpOnly: true,
        },
    })
);


// routes
// SERVER.use(routes);


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
        stack: IS_PRODUCTION ? null : err.stack,
    });
});




export default SERVER;
