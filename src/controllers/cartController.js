import mongoose from "mongoose";
import CartDao from "../dao/cartDao.js";

const cartDao = new CartDao();

class CartController {

    async getAllCarts() {
        try {
            return await cartDao.getAllCartsDao();
        } catch (error) {
            throw new Error("Error al buscar los carritos");
        }
    }

    async getCartById(cid) {
        if (!cid || !mongoose.isValidObjectId(cid)) {
            throw new Error("El CID del carrito no es válido");
        }

        try {
            const cart = await cartDao.getCartByIdDao(cid);

            if (!cart) {
                throw new Error(`No se encontró el carrito con CID: ${cid}`);
            }

            return cart;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createCart() {
        try {
            return await cartDao.createCartDao();
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async updateCart(cid, updated) {
        await this.getCartById(cid);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        try {
            return await cartDao.updateCartDao(cid, updated);
        } catch (error) {
            throw new Error(`Error al actualizar el carrito con CID: ${cid}`);
        }
    }

    async deleteCart(cid) {
        await this.getCartById(cid);

        try {
            return await cartDao.deleteCartDao(cid);
        } catch (error) {
            throw new Error(`Error al eliminar el carrito con CID: ${cid}`);
        }
    }
}

export default CartController;
