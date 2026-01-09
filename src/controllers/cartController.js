
import CartService from "../service/cartService.js";

const cartService = new CartService();

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
            res.status(201).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Agregar un producto al carrito
    addProductInCart = async (req, res) => {
        const { cid, pid } = req.params;
        const quantity = req.body?.quantity ?? 1;

        try {
            const result = await cartService.addProductInCart(cid, pid, quantity);
            res.status(201).send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    }

    // Remover producto del carrito
    removeProductInCart = async (req, res) => {
        const { cid, pid } = req.params;

        try {
            const result = await cartService.removeProductInCart(cid, pid);
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
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
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    };


    updateCart = async (req, res) => {
        const { cid } = req.params;
        const updated = req.body;

        try {
            const result = await cartService.updateCart(cid, updated);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    //Eliminar el carrito
    deleteCart = async (req, res) => {
        const { cid } = req.params;

        try {
            const result = await cartService.deleteCart(cid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default CartController;
