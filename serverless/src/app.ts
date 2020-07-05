import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { crawledFromPortal } from './common/crawl';
import axios from "axios";

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
//  "AKfycbxx7A1zfUqZFhPKCGJkxiUnNYnYcv9zpinPmd-Pmf7q"
//  "AKfycbwrAJJU9fOcTOLSGu9s9a1gAvKMdsYQZvtINHakGtcmhE7nihGH5FjNH5BzxTn_Ej0jgA"
  const response = await axios.post("https://script.google.com/macros/s/" + "AKfycbwFgfDfIFvcBH8Tf2QKagJghceizuadIzhEzaVHPC4fvJA1B-PdCZDONyyUtVwLCe8Dvw" + "/exec", dataObjects);
  res.json({data: response.data, status: response.status});
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
