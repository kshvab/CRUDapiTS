import { app } from './app';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as express from 'express';

import { PORT, MONGO_URL } from '../config';

const server = http.createServer(app);
server.listen(PORT);

server.on('listening', async () => {
  console.info(`SERVER:\tListening on port ${PORT}`);
  const dbConnect = mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  mongoose.connection
    .on('open', () => {
      let info = mongoose.connections;
      if (info)
        console.log(
          `SERVER:\tConnected to MONGO DB\n\thost: ${info[0].host}\n\tport: ${info[0].port}`
        );
    })
    .on('close', () => console.log('SERVER:\tDatabase connection closed.'))
    .on('error', (err: any) => {
      console.error(err);
    });

  app.get(
    '/appstatus',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const appStatus = {
        server: {
          name: 'Dream it, plan it, do it - API server',
          isListening: server.listening,
          port: PORT
        },
        database: {
          isConnected: Boolean(mongoose.connection.readyState),
          cluster: mongoose.connections[0].name,
          host: mongoose.connections[0].host,
          port: mongoose.connections[0].port
        }
      };

      res.json(appStatus);
    }
  );
  // catch 404 and forward to error handler
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const err = new Error('Not Found');
      err.name = '404';
      next(err);
    }
  );

  // error handler
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const status = Number(error.name) || 500;
      res.status(status);
      res.json({
        error: status,
        message: error.message
      });
      return;
    }
  );
});
