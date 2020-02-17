import * as mongoose from 'mongoose';

interface CounterDoc extends mongoose.Document {
  _id: string;
  sequence_value: number;
}

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  sequence_value: {
    type: Number,
    required: true
  }
});

const counter = mongoose.model<CounterDoc>('counter', counterSchema);

export { counter };
