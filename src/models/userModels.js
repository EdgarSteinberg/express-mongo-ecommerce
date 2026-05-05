import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  /*   first_name: { type: String, minLength: 5, required: true },
    last_name: { type: String, minLength: 5, required: true }, */
  first_name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    minlength: [5, "El nombre debe tener al menos 5 caracteres"],
    match: [/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "El nombre solo puede contener letras"]
  },
  last_name: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    minlength: [5, "El apellido debe tener al menos 5 caracteres"],
    match: [/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "El apellido solo puede contener letras"]
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "El email no es válido"]
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
