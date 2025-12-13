import { Router } from "express";
import CartController from "../controllers/cartController.js";

const cartController = new CartController();
const router = Router();

//Buscar todos los carritos
router.get('/', async (req, res) => {
    try {
        const result = await cartController.getAllCarts();
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Buscar carrito por su CID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartController.getCartById(cid);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await cartController.createCart();
        res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body?.quantity ?? 1;

    try {
        const result = await cartController.addProductInCart(cid, pid, quantity);
        res.status(201).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Remover producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const result = await cartController.removeProductInCart(cid, pid);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Actualizar la cantidad del producto
router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body?.quantity; // <-- NO rompe aunque req.body sea undefined

    // Validación súper simple
    if (!quantity) {
        return res.status(400).send({ status: "error", message: "Debes enviar 'quantity' en el body" });
    }

    try {
        const result = await cartController.updatedProductQuantity(cid, pid, quantity);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const updated = req.body;

    try {
        const result = await cartController.updateCart(cid, updated);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Remover carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartController.deleteCart(cid);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
