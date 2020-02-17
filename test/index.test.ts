import * as mongoose from 'mongoose';
import { expect } from 'chai';
import { app } from '../src/app';
import { agent as request } from 'supertest';
import { MONGO_URL, TEST_API_KEY } from '../config';

const dbConnect = mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

describe('404 and Protection Tests', () => {
  it('Should GET 404 status', async () => {
    let res = await request(app).get('/1111');
    expect(res.status).to.equal(404);
  }).timeout(10000);

  it('Should GET 401 status', async () => {
    let res = await request(app).get('/newkey');
    expect(res.status).to.equal(401);
  }).timeout(10000);
});

describe('get with API-key', () => {
  it('Should GET 200 status', async () => {
    let res = await request(app)
      .get('/cards/35')
      .set('x-api-key', TEST_API_KEY);
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
  }).timeout(10000);

  it('Should GET array of users', async () => {
    let res = await request(app)
      .get('/users')
      .set('x-api-key', TEST_API_KEY);
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('array');
  }).timeout(10000);
});
