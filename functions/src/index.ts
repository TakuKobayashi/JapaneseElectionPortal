import { config, region } from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

require('dotenv').config();
admin.initializeApp(config().firebase);

const app = express();

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

export const api = region('asia-northeast1').https.onRequest(app);

export default app;

