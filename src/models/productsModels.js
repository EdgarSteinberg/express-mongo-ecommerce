import mongoose from "mongoose";

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    discount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    mainImage: { type: String }
});

export const productModel = mongoose.model(productCollection, productSchema);