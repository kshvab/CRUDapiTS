import { app } from './app';
import * as http from 'http';
import * as mongoose from 'mongoose';

import { PORT, MONGO_URL } from '../config';

const server = http.createServer(app);
server.listen(PORT);
server.on('listening', async () => {
  console.info(`SERVER:\tListening on port ${PORT}`);

  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
});
