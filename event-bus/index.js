import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import fetch from 'node-fetch';
import { errorHandler, logRequestsResponse } from './modules/middlewares.js';
import log from './logger.js';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(logRequestsResponse);

const servicePorts = [
  { name: 'sheets', port: 4000 },
  { name: 'categories', port: 4001},
  { name: 'items', port: 4002}, 
  { name: 'query', port: 4003}
];

/**
 * Handles the POST request for retrieving all events.
 * - Iterates over the ports of all services and sends the event to each service with the data.
 * - Sends a response with status 'OK'.
 * - Event types: 'SheetCreated', 'CategoryCreated', 'ItemCreated' 
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/events', async (req, res) => {
  const event = req.body;

  log.debug(`(${process.pid}) Event Bus (Received Event) ${event.type}`);
  log.debug('PORTS AVAILABLE: ', servicePorts);

  for (const { name, port } of servicePorts) {
    try {
      log.debug(
        `(${process.pid}) Event Bus (Sending Event to ${port}) ${event.type}`
      );

      const response = await fetch(`http://${name}:${port}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        log.debug(`Response error from service at port ${port}: ${response.status}`);
        log.error(`Response error from service at port ${port}: ${response.status}`);
      }
    } catch (err) {
      log.error(`Error sending response in fetch call: ${err}, ${err.stack}}`);
    }
  }

  res.send({ status: 'OK' });
  log.debug(`(${process.pid}) Event Bus (Sent Event) ${event.type}`);
});

app.use(errorHandler);

app.listen(4005, () => {
  console.log(`(${process.pid}) Event Bus Listening on 4005`);
});
