import mongoose from "mongoose";
import CartDao from "../dao/cartDao.js";
import ProductDao from "../dao/productDao.js";

const productDao = new ProductDao();
const cartDao = new CartDao();

class CartController {

    //Buscar todos los carritos
    async getAllCarts() {
        try {
            return await cartDao.getAllCartsDao();
        } catch (error) {
            throw new Error("Error al buscar los carritos");
        }
    }

    //Buscar el carrito por su CID
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

    //Crear un carrito
    async createCart() {
        try {
            return await cartDao.createCartDao();
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }


    // Agregar un producto al carrito
    async addProductInCart(cid, pid, quantity = 1) {
        // Validación de cid
        if (!cid || !mongoose.isValidObjectId(cid)) {
            throw new Error('Carrito con CID no válido');
        }

        // Validación de pid
        if (!pid || !mongoose.isValidObjectId(pid)) {
            throw new Error('Producto con PID no válido');
        }

        // Validación de quantity
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            throw new Error('Cantidad inválida');
        }

        await this.getCartById(cid);
        await productDao.getProductByIdDao(pid);

        try {
            const result = await cartDao.addProductInCartDao(cid, pid, quantity);
            return result;

        } catch (error) {
            throw new Error(`Error al agregar un producto al carrito con CID: ${cid} : ${error.message}`);
        }
    }

    // Remover producto del carrito
    async removeProductInCart(cid, pid) {
        if (!cid || !mongoose.isValidObjectId(cid)) {
            throw new Error(`El cid no es un valor válido!`);
        }

        if (!pid || !mongoose.isValidObjectId(pid)) {
            throw new Error(`El pid no es un valor válido!`);
        }

        // Valido existencia del carrito y del producto
        await this.getCartById(cid);
        await productDao.getProductByIdDao(pid);

        try {
            const result = await cartDao.removeProductCartDao(cid, pid);
            return result;

        } catch (error) {
            throw new Error(`Error al remover el producto ${pid} del carrito ${cid}: ${error.message}`);
        }
    }

    //Actualizar la cantidad del producto 
    async updatedProductQuantity(cid, pid, quantity) {
        if (!cid || !mongoose.isValidObjectId(cid)) {
            throw new Error(`Cid no proporcionado o no valido!`);
        }

        if (!pid || !mongoose.isValidObjectId(pid)) {
            throw new Error(`Pid no proporcionado o no valido!`);
        }

        // Validación correcta de quantity
        if (quantity == null || isNaN(quantity) || quantity <= 0) {
            throw new Error('Cantidad inválida');
        }

        await this.getCartById(cid);
        await productDao.getProductByIdDao(pid);

        try {
            const result = await cartDao.updateProductQuantity(cid, pid, quantity);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del carrito ${cid}`);
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

    //Eliminar el carrito
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
