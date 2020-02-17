import * as mongoose from 'mongoose';

interface UserDoc extends mongoose.Document {
  _id: number;
  name?: string;
  surname?: string;
  username: string;
  email?: string;
  cards: string[];
}

const userSchema = new mongoose.Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: false,
      default: ''
    },
    surname: {
      type: String,
      required: false,
      default: ''
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    cards: [
      {
        cardNumber: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const user = mongoose.model<UserDoc>('user', userSchema);

export { user, UserDoc };
