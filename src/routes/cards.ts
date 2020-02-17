import * as express from 'express';
import * as fetch from 'node-fetch';
import * as moment from 'moment';

import { LITACHKA_API_URL } from '../../config';

const cardsRouter = express.Router();

function p_api<T>(id: string, infoType: string): Promise<T> {
  return fetch(`${LITACHKA_API_URL}${id}/${infoType}`).then(response => {
    if (!response.ok) {
      throw new Error(response.stateText);
    }
    return response.json() as Promise<T>;
  });
}

/*
function p_api(id: string, infoType: string) {
  return new Promise((resolve, reject) => {
    fetch(`${LITACHKA_API_URL}${id}/${infoType}`)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
*/

interface apiDoc {
  state_description?: string;
  validity_end?: string;
  error_description?: string;
}

cardsRouter.get(
  '/:id',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id: string = req.params.id;
    Promise.all([p_api(id, 'state'), p_api(id, 'validity')]).then(function(
      values
    ) {
      //  const [apiState, apiExpiration] = values;
      const apiState: apiDoc = values[0];
      const apiExpiration: apiDoc = values[1];

      let state: string = apiState.error_description
        ? apiState.error_description
        : apiState.state_description;

      let expiration: string = apiExpiration.error_description
        ? apiExpiration.error_description
        : moment(apiExpiration.validity_end).format('DD.M.YY');

      if (apiState.error_description || apiExpiration.error_description)
        res.status(500);

      res.json({
        state,
        expiration
      });
    });
  }
);

export default cardsRouter;
