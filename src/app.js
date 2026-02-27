//Config
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIexpress from 'swagger-ui-express';
import __dirname from './utils/dirname.js';

//Router
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';

//Passport
import initializePassport from './config/passportConfig.js';

//Express
const app = express();

//MongoDB connect
const uri = process.env.NODE_ENV === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
await mongoose.connect(uri);

console.log("Conectando a DB:",
    process.env.NODE_ENV === "test" ? "TEST" : "PROD"
);

console.log("DB usada:", mongoose.connection.name);



//Cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Para que nuestro servidor express pueda interpretar en forma automatica mensajes de tipo JSON
// Middlewares Express y CookieParser
app.use(express.json()); // Formatear datos que vienen del cuerpo de la solicitud req.body
app.use(express.urlencoded({ extended: true })); //Para parametros GET
app.use(express.static('public'));
app.use(cookieParser());

//Passport
initializePassport();
app.use(passport.initialize());



//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);


//Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'API para la gestión de productos, usuarios, órdenes y autenticación'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: [`${__dirname}/../docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUIexpress.serve, swaggerUIexpress.setup(specs));

export default app;


/* const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
 */