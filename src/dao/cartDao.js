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

    // Agregar producto al carrito
    async addProductInCartDao(cid, pid, quantity = 1) {

        // 1. Intentar incrementar cantidad si ya existe
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid, "products.product": pid },
            { $inc: { "products.$.quantity": quantity } },
            { new: true }
        );

        // 2. Si no existe, hacemos push
        if (!updatedCart) {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { $push: { products: { product: pid, quantity } } },
                { new: true }
            );
        }

        return updatedCart;
    }

    // Remover producto del carrito
    async removeProductCartDao(cid, pid) {
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: { product: pid } } },
            { new: true }
        );

        return updatedCart;
    }

    // Actualizar la cantidad
    async updateProductQuantity(cid, pid, quantity) {
        return await cartModel.findOneAndUpdate(
            { _id: cid, "products.product": pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
        );
    }


    // Eliminar carrito
    async deleteCartDao(cid) {
        await this.getCartByIdDao(cid); // valida existencia

        return await cartModel.deleteOne({ _id: cid });
    }


    //Nueva opcional:  Reemplazar todos los productos del carrito
    async replaceCartProductsDao(cid, newProducts) {
        return await cartModel.findOneAndUpdate(
            { _id: cid },
            { $set: { products: newProducts } },
            { new: true }
        );
    }
}

export default CartDao;
