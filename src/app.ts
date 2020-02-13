import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { requestLoggerMiddleware } from './request.logger.middleware';
import * as routes from './routes';

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(requestLoggerMiddleware);
app.use('/publications', routes.publications);

export { app };
