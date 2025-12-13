//Config
import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";

//Router
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';


//Dotenv Express
dotenv.config();
const app = express();

//MongoDB connect
const uri = process.env.MONGO_URI;
mongoose.connect(uri);

//Cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
