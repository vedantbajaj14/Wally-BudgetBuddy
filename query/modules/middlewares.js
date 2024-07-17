// modules/middlewares.js

import logger from '../logger.js';

/**
 * Error handling middleware for Express.
 * Logs the error and sends a generic error message to the client.
 */
export function errorHandler(err, req, res, next) {
    logger.error(`process_ID: ${process.pid}, Error occurred: ${err.message}`, { errorMessage: err.message, stack: err.stack });
    res.status(500).send('Internal Server Error');
}

/**
 * Request and response logging middleware for Express.
 * Logs the details of the request and the response time after the response is sent.
 */
export function logRequestsResponse(req, res, next) {
    const startHrTime = process.hrtime();
    const originalSend = res.send;

    res.send = function(body) {
        if (typeof body === 'string' && isJson(body)) {
            res.locals.responseBody = JSON.parse(body);
        } else {
            res.locals.responseBody = body;
        }
        return originalSend.apply(res, arguments);
    };

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        logger.info(`process_ID: ${process.pid}, method: ${req.method}, url: ${req.url}, Response time: ${elapsedTimeInMs}ms, 
        body: ${JSON.stringify(req.body)}, query: ${JSON.stringify(req.query)} status: ${res.statusCode}, response: ${JSON.stringify(res.locals.responseBody)}`);
    });

    next();
}

function isJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}