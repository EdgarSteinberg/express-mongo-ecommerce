import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  /*   first_name: { type: String, minLength: 5, required: true },
    last_name: { type: String, minLength: 5, required: true }, */
  first_name: {
    type: String,
    minlength: [5, "El nombre debe tener al menos 5 caracteres"]
  },
  last_name: {
    type: String,
    minlength: [5, "El apellido debe tener al menos 5 caracteres"]
  },
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
  },
  last_connection: { type: Date, default: Date.now }
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;
