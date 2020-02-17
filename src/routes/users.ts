import * as express from 'express';
import { counter, user, UserDoc } from '../models';
const usersRouter = express.Router();

function getNextSequenceValue(sequenceName) {
  return new Promise(function(resolve, reject) {
    counter.findOne({ _id: sequenceName }).then(counterFromDB => {
      let currentNumber: number = counterFromDB.sequence_value;
      counterFromDB.sequence_value = currentNumber + 1;
      counterFromDB.save();
      resolve(counterFromDB.sequence_value);
    });
  });
}

/************    ASYNC example    ***************
usersRouter.get(
  '/',
  async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let usersFromDb: UserDoc[] = await user.find({});
      res.send(usersFromDb);
    } catch (err) {
      res.status(500);
      res.send(err);
      console.error('Caught error', err);
    }
  }
);
**************************************************/

usersRouter.get('/', (req: express.Request, res: express.Response) => {
  user.find((err: Error, usersFromDb: UserDoc[]) => {
    if (err) res.send(err);
    else {
      res.send(usersFromDb);
    }
  });
});

usersRouter.get('/:id', (req: express.Request, res: express.Response) => {
  user.findById(req.params.id, (err: Error, userfromDb: UserDoc) => {
    if (err) res.send(err);
    else if (!userfromDb) res.status(404).send('Such user does not exist');
    else res.send(userfromDb);
  });
});

usersRouter.post('/', (req: express.Request, res: express.Response) => {
  //  First Counter Creation:
  //  counter.create({ _id: 'user_id', sequence_value: 20 });

  if (!req.body.username || !req.body.cards || !req.body.cards.length) {
    res.status(400).send('Invalid User');
    return;
  }

  getNextSequenceValue('user_id').then(_id => {
    _id = Number(_id);
    req.body._id = _id;

    const userToDb = new user(req.body);
    userToDb.save((err: Error) => {
      if (err) res.send(err);
      else res.send(userToDb);
    });
  });
});

usersRouter.delete('/:id', (req: express.Request, res: express.Response) => {
  user.deleteOne({ _id_: req.params.id }, (err: Error) => {
    if (err) res.send(err);
    else res.send(`User #${req.params.id} deleted successfully`);
  });
});

usersRouter.put('/:id', (req: express.Request, res: express.Response) => {
  user.findByIdAndUpdate(
    req.params.id,
    req.body,
    (err: Error, user: UserDoc) => {
      if (err) res.send(err);
      else if (!user) res.status(404).send('Such user does not exist');
      else res.send(`User #${req.params.id} updated successfully`);
    }
  );
});

export default usersRouter;
