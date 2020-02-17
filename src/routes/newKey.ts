import * as express from 'express';
import * as uuidv1 from 'uuidv1';
import { apikey } from '../models';

const newKeyRouter = express.Router();

newKeyRouter.get(
  '/',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers['x-api-key'] == 'operatorict') {
      createNewUser();
    } else
      res
        .status(401)
        .send('Access denied,\na valid administrator Header is required!');

    function createNewUser() {
      const generatedApiKey = uuidv1();
      const newApiKey = new apikey({ key: generatedApiKey });
      newApiKey.save(function(err) {
        if (err) {
          res.status(500).send('Problems with connecting to DB');
          return err;
        }
        res.send('New API-key generated: ' + generatedApiKey);
      });
    }
  }
);

export default newKeyRouter;
