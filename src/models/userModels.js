import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: { type: String, minLength: 2, required: true },
  last_name: { type: String, minLength: 2, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  age: { type: Number, min: 18, required: true },
  password: { type: String, required: true },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'premium', 'user'],
    default: 'user'
  }
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;
