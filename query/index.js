import express from 'express';
import cors from 'cors';
import Store from './store.js';
import logger from 'morgan';
import { errorHandler, logRequestsResponse } from './modules/middlewares.js';
import log from './logger.js';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(logRequestsResponse);

/**
 * Handles the GET request for retrieving all sheets.
 *  - Returns all sheets, with their categories and the items in each category of that sheet.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/sheets', (req, res) => {
  log.debug(`(${process.pid}) Query Service: GET /sheets called, returning all data`);
  const sheets = Store.read();
  res.send(sheets);
  log.debug(`(${process.pid}) Query Service: GET /sheets response sent`);
});

/**
 * Handles the DELETE request for deleting all sheets.
 * - Deletes all sheets, categories and items.
 * - Returns an OK response.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}  
 */
app.delete('/sheets', async (req, res) => {
  log.debug(`(${process.pid}) Query Service: DELETE /sheets called, deleting all data`);
  Store.drop();
  await emitDropEvent();
  res.send({ status: 'OK' });
  log.debug(`(${process.pid}) Query Service: DELETE /sheets response sent`);
});

/**
 * Handles the POST request for getting data from the event bus and updating the sheets object.
 * - Updates the sheets object based on the event type.
 * - Event types: SheetCreated, CategoryCreated, ItemCreated
 * - Returns an OK response.
 * - Logs the sheets object.
 * - Writes the sheets object to the store.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  log.debug('Event Received:', type);

  const sheets = Store.read();

  if (type === 'SheetCreated') {
    const { id, title } = data;
    sheets[id] = { id, title, categories: [] };
  }

  if (type === 'CategoryCreated') {
    const { id, category, sheetId } = data;
    const sheet = sheets[sheetId];
    sheet.categories.push({ id, category, items: [] });
  }

  if (type === 'ItemCreated') {
    const { id, item, amount, categoryId, sheetId } = data;
    const sheet = sheets[sheetId];
    const categoryObj = sheet.categories.find(categoryObj => categoryObj.id === categoryId);
    categoryObj.items.push({ id, item, amount });
  }
  
  Store.write(sheets);
  log.debug(`(${process.pid}) Query Service: All Data - ${JSON.stringify(sheets)}`);

  res.send({ status: 'OK' });
  log.debug(`(${process.pid}) Query Service: POST /events response sent`);
});

const emitDropEvent = async () => {
  try {
    await fetch('http://event-bus:4005/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'DropStorage', 
      }),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 'ERROR',
      message: err,
    });
  }
}

app.use(errorHandler);

app.listen(4003, () => {
  console.log('Listening on 4002');
});
