import * as express from 'express';
import { publication } from '../models';

const publicationsRouter = express.Router();

publicationsRouter.get(
  '/',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let items: any = await publication.find({});
      res.json(items);
    } catch (err) {
      res.status(500);
      res.end();
      console.error('Caught error', err);
    }
  }
);

publicationsRouter.post(
  '/',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.info(req.body);
    res.end();
  }
);

publicationsRouter.put(
  '/:id',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.info(req.body);
    console.info(req.params.id);
    res.end();
  }
);

publicationsRouter.delete(
  '/:id',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.info(req.params.id);
    res.end();
  }
);

export default publicationsRouter;
