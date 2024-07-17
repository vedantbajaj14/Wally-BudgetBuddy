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
 * Handles the GET request for retrieving all sheets.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/sheets', (req, res) => {
  log.debug(`(${process.pid}) Sheets Service: GET /sheets called`);
  const sheets = Store.read();
  log.debug(`(${process.pid}) Sheets Service: ${JSON.stringify(sheets)}`);
  res.send(sheets);
  log.debug(`(${process.pid}) Sheets Service: GET /sheets response sent`);
});


/**
 * Handles the POST request for creating a new sheet.
 *  - Generates a random id for the sheet.
 * - Adds the sheet to the sheets object.
 * - Writes the sheets object to the store.
 * - Sends a 'SheetCreated' event to the Event Bus.
 *  - Sends the sheet object in the response.
 *  - Sends an error response if the event bus is down.
 *  - Sends an error response if the event bus returns an error.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/sheets', async (req, res) => {
  log.debug(`(${process.pid}) Sheets Service: POST /sheets called`);
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  if (!title) {
    log.error(`(${process.pid}) Sheets Service: Title is required. ${err}`);
    return res.status(400).send({
      status: 'ERROR',
      message: 'Title is required',
    });
  }

  const sheets = Store.read();
  log.debug(`(${process.pid}) Sheets Service: ${JSON.stringify(sheets)}`);

  sheets[id] = { id, title };
  Store.write(sheets);
  log.debug(`(${process.pid}) Sheets Service: modified Sheets Data: ${JSON.stringify(sheets)}`);
  try {
    await fetch('http://event-bus:4005/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'SheetCreated',
        data: {
          id,
          title,
        },
      }),
    });
  } catch (err) {
    log.error(`(${process.pid}) Sheets Service: ${err}`);
    return res.status(500).send({
      status: 'ERROR',
      message: err,
    });
  }

  res.status(201).send(sheets[id]);
  log.debug(`(${process.pid}) Sheets Service: ${JSON.stringify(sheets)}`);
});

/**
 * Handles the POST request for incoming requests from the Event Bus.
 * - Logs the event type.
 * - Sends an empty response.
 */
app.post('/events', async (req, res) => {
  const event = req.body;
  log.debug(`(${process.pid}) Sheets Service Received Event: ${event.type}`);
  if (event.type === 'DropStorage') {
    Store.drop();
  }
  res.send({});
});

// uses the middleware to handle errors and logs to a file in the logs folder
app.use(errorHandler);

// starts the server on port 4000
app.listen(4000, () => {
  console.log(`(${process.pid}) Sheets Service: Listening on 4000`);
});
