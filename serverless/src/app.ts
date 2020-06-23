import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { crawledFromPortal } from './common/crawl';

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
  res.json(await crawledFromPortal());
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
