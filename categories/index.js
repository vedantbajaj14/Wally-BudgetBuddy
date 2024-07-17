import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import Store from './store.js';
import { errorHandler, logRequestsResponse } from './modules/middlewares.js';
import log from './logger.js';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(logRequestsResponse);

/**
 * Handles the GET request for retrieving all categories for a sheet.
 *  - Returns all categories for the sheet with the given id.
 * - Returns an empty array if the sheet does not exist.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/sheets/:id/categories', (req, res) => {
    log.debug(`(${process.pid}) Categories Service: GET /sheets/:id/categories called`);
    const categoriesBySheetId = Store.read();
    const sheetId = req.params.id;
    res.send(categoriesBySheetId[sheetId] || []);
    log.debug(`(${process.pid}) Categories Service: ${JSON.stringify(categoriesBySheetId)} response sent`);
});

/**
 * Handles the POST request for creating a new category in the given sheet id.
 * - Generates a random id for the category.
 * - Adds the category to the categories object.
 * - Writes the categories object to the store.
 * - Sends a 'CategoryCreated' event to the Event Bus.
 * - Sends the category object in the response.
 * - Sends an error response if the event bus is down.
 * - Sends an error response if the event bus returns an error.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/sheets/:id/categories', async (req, res) => {
    log.debug(`(${process.pid}) Categories Service: POST /sheets/:id/categories`);
    
    const { category } = req.body;
    const sheetId = req.params.id;

    log.debug(`(${process.pid}) Categories Service: creating category - ${category} in sheet ${sheetId}`);
    
    const id = randomBytes(4).toString('hex');

    const categoriesBySheetId = Store.read();
    const categories = categoriesBySheetId[sheetId] || [];

    categories.push({ id, category });
    categoriesBySheetId[sheetId] = categories;
    Store.write(categoriesBySheetId);
    log.debug(`(${process.pid}) Categories Service: modified Categories Data: ${JSON.stringify(categoriesBySheetId)}`);

    try {
        await fetch('http://event-bus:4005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'CategoryCreated',
                data: {
                    id,
                    category,
                    sheetId
                },
            }),
        });
    } catch (err) {
        log.error(`(${process.pid}) Categories Service: ${err}`);
        return res.status(500).send({
            status: 'ERROR',
            message: err,
        });
    }

    res.status(201).send({ id, category });
    log.debug(`(${process.pid}) Categories Service: ${JSON.stringify(categoriesBySheetId)} response sent`);
});

/**
 * Handles the POST request for getting data from the event bus and just listening to it/doing nothing with it.
 * - Returns an empty object.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/events', async (req, res) => {
    const event = req.body;
    log.debug(`(${process.pid}) Categories Service Received Event: ${event.type}`);
    if (event.type === 'DropStorage') {
        Store.drop();
    }
    res.send({});
});

app.use(errorHandler);

app.listen(4001, () => {
  console.log(`(${process.pid}) Categories Service: Listening on 4001`);
});
