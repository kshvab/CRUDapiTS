import { MongoHelper } from './mongo.helper';
import { app } from './app';
import * as http from 'http';
import { PORT, MONGO_URL } from '../config';

const server = http.createServer(app);
server.listen(PORT);
server.on('listening', async () => {
  console.info(`SERVER:\t Listening on port ${PORT}`);

  try {
    await MongoHelper.connect(MONGO_URL);
    console.info('SERVER:\t Connected to MONGO DB');
  } catch (err) {
    console.error(err);
  }
});
