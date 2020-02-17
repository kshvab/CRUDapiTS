import * as express from 'express';

import { apikey } from './models';

const protectionMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  apikey.findOne({ key: req.headers['x-api-key'] }, function(err, result) {
    if (err) {
      console.log('Problems with connecting to DB');
      res.status(500).send('Problems with connecting to DB');
    }
    if (result) next();
    else {
      res.status(401).send('Access denied,\na valid API key is Required!');
    }
  });
};

export { protectionMiddleware };
