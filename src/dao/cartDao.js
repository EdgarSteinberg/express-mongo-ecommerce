import { cartModel } from "../models/cartModels.js";

class CartDao {

    // Obtener todos los carritos
    async getAllCartsDao() {
        return await cartModel.find().lean();
    }

    // Obtener carrito por ID
    async getCartByIdDao(cid) {
        const cart = await cartModel.findById(cid);

        if (!cart) {
            throw new Error(`El carrito con ID: ${cid} no se encuentra`);
        }

        return cart;
    }

    // Crear carrito vacío
    async createCartDao() {
        return await cartModel.create({});
    }

    // Actualizar carrito
    async updateCartDao(cid, updatedData) {
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid },
            updatedData,
            { new: true } // devuelve el carrito actualizado
        );

        if (!updatedCart) {
            throw new Error(`No se pudo actualizar el carrito con ID: ${cid}`);
        }

        return updatedCart;
    }

    // Eliminar carrito
    async deleteCartDao(cid) {
        await this.getCartByIdDao(cid); // valida existencia

        return await cartModel.deleteOne({ _id: cid });
    }
}

export default CartDao;
