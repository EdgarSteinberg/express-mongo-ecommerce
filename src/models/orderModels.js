import mongoose from 'mongoose';

const orderCollection = 'orders';


const orderSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    purchaseDateTime: {type: Date, default: Date.now}
});

const orderModel = mongoose.model(orderCollection, orderSchema);

export default orderModel;