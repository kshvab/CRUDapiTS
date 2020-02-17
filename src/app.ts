import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import * as routes from './routes';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

import { requestLoggerMiddleware } from './request.logger.middleware';
import { protectionMiddleware } from './protection.middleware';

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//  console logger middleware
app.use(requestLoggerMiddleware);

//  inside protected route
app.use('/newkey', routes.newKey);

//  potectad routes
app.use('/users', protectionMiddleware, routes.users);
app.use('/cards', protectionMiddleware, routes.cards);

export { app };
