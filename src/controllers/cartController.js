import CartService from "../service/cartService.js";
const cartService = new CartService();

import logger from "../loggers/logger.js";

class CartController {

    //Buscar todos los carritos
    getAllCarts = async (req, res) => {
        try {
            const result = await cartService.getAllCarts();
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    //Buscar el carrito por su CID
    getCartById = async (req, res) => {
        const { cid } = req.params;
        try {
            const result = await cartService.getCartById(cid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    //Crear un carrito
    createCart = async (req, res) => {
        try {
            const result = await cartService.createCart();
            logger.info(`Carrito creado - ID: ${result._id}`);
            res.status(201).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al crear al carrito ${error.message}`);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Agregar un producto al carrito
    addProductInCart = async (req, res) => {
        const { cid, pid } = req.params;
        const quantity = req.body?.quantity ?? 1;

        try {
            const result = await cartService.addProductInCart(cid, pid, quantity);
            logger.info(`Producto ${pid} agregado al carrito ${cid} - Cantidad: ${quantity}`);
            res.status(201).send({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al agregar producto ${pid} al carrito ${cid} - ${error.message}`);
            res.status(500).send({ status: 'error', message: error.message });
        }
    }

    // Remover producto del carrito
    removeProductInCart = async (req, res) => {
        const { cid, pid } = req.params;

        try {
            const result = await cartService.removeProductInCart(cid, pid);
            logger.info(`Producto ${pid} removido del carrito ${cid}`)
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al remover producto ${pid} del carrito ${cid} - ${error.message}`);
            res.status(500).send({ status: 'error', message: error.message });
        }
    }

    //Actualizar la cantidad del producto 
    updatedProductQuantity = async (req, res) => {
        const { cid, pid } = req.params;
        const quantity = req.body?.quantity; // <-- NO rompe aunque req.body sea undefined

        // Validación súper simple
        if (!quantity) {
            return res.status(400).send({ status: "error", message: "Debes enviar 'quantity' en el body" });
        }

        try {
            const result = await cartService.updatedProductQuantity(cid, pid, quantity);
            logger.info(`Cantidad actualizada - Carrito: ${cid}, Producto: ${pid}, Nueva cantidad: ${quantity}`);
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al actualizar - Carrito: ${cid}, Producto: ${pid}, Nueva cantidad: ${quantity} ${error.message}`);
            res.status(500).send({ status: 'error', message: error.message });
        }
    };


    updateCart = async (req, res) => {
        const { cid } = req.params;
        const updated = req.body;

        try {
            const result = await cartService.updateCart(cid, updated);
            logger.info(`Carrito ${cid} actualizado`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al modificar el Carrito ID ${cid} - ${error.message}`);
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    //Eliminar el carrito
    deleteCart = async (req, res) => {
        const { cid } = req.params;

        try {
            const result = await cartService.deleteCart(cid);
            logger.info(`Carrito eliminado - ID: ${cid}`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al eliminar el carrito con ID: ${cid} - ${error.message}`);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default CartController;
