import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { crawledFromPortal } from './common/crawl';
import axios from 'axios';
const querystring = require('querystring');

const app = express();
const server = awsServerlessExpress.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/test', async (req, res) => {
  const dataObjects = await crawledFromPortal();
  const query = querystring.stringify({ keys_column_row: 1, primary_key: 'id' });
  const url =
    'https://script.google.com/macros/s/' + 'AKfycbyDLKvByiKNjWn7uZsN1Z6obJDOwyMcSD68flgf0GIAemQ3T7jOlCdhbKcO1eNdq6S-UA' + '/exec?' + query;
  const response = await axios.post(url, dataObjects);
  res.json({ status: response.status, data: response.data });
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
