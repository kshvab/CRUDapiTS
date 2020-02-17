import * as mongoose from 'mongoose';

const apikeySchema = new mongoose.Schema(
  {
    key: String
  },
  {
    timestamps: true
  }
);

const apikey = mongoose.model('apikey', apikeySchema);

export { apikey };
