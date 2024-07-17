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

// uses the middleware to log requests and responses and logs to a file in the logs folder
app.use(logRequestsResponse);

/**
 * Handles the GET request for retrieving all items for a category in a sheet.
 * - Returns all items for the category with the given id in the sheet with the given id.
 * - Returns an empty array if the sheet or category does not exist.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/sheets/:sheetId/categories/:categoryId/items', (req, res) => {
    const { sheetId, categoryId } = req.params;
    log.debug(`(${process.pid}) Items Service: GET /sheets/sheetId/categories/categoryId/items called`);
    const itemsByCategoryIdBySheetId = Store.read()[sheetId]?.[categoryId] || [];
    res.send(itemsByCategoryIdBySheetId);
    log.debug(`(${process.pid}) Items Service: response sent with data ${JSON.stringify(itemsByCategoryIdBySheetId)}`);
});

// Create a new item in a specific category of a sheet
/**
 * Handles the POST request for creating a new item in a category in a sheet.
 * - Generates a random id for the item.
 * - Checks if the sheet exists in the store.
 * - Checks if the category exists in the sheet in the store.
 * - Adds the item to the items object.
 * - Writes the items object to the store.
 * - Sends an 'ItemCreated' event to the Event Bus.
 * - Sends the item object in the response.
 * - Sends an error response if the event bus is down.
 * - Sends an error response if the event bus returns an error.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/sheets/:sheetId/categories/:categoryId/items', async (req, res) => {
    log.debug(`(${process.pid}) Items Service: POST /sheets/sheetId/categories/categoryId/items called`);
    const { sheetId, categoryId } = req.params;
    const { item, amount } = req.body;

    const id = randomBytes(4).toString('hex');
    const newItem = { id, item, amount };

    const store = Store.read();
    if (!store[sheetId]) {
        store[sheetId] = {};
    }
    if (!store[sheetId][categoryId]) {
        store[sheetId][categoryId] = [];
    }
    store[sheetId][categoryId].push(newItem);
    Store.write(store);
    log.debug(`(${process.pid}) Items Service: bew item added to store ${JSON.stringify(store)}`);

    try {
        await fetch('http://event-bus:4005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'ItemCreated',
                data: {
                    id,
                    item,
                    amount,
                    categoryId,
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

    res.status(201).send(newItem);
    log.debug(`(${process.pid}) Items Service: ${JSON.stringify(store)} response sent`);
});

/**
 * Handles the POST request for getting data from the event bus and just listening to it/doing nothing with it.
 * - Returns an empty object.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/events', (req, res) => {
    const event = req.body;
    log.debug(`{${process.pid}}Items Service Received Event: ${event.type}`);
    if (event.type === 'DropStorage') {
        Store.drop();
    }
    res.send({});
});

// uses the middleware to handle errors and logs to a file in the logs folder
app.use(errorHandler);

app.listen(4002, () => {
    console.log(`(${process.pid}) Items Service: Listening on 4002`);
});
