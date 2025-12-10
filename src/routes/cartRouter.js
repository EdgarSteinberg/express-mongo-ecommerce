import { Router } from "express";
import CartController from "../controllers/cartController";

const cartController = new CartController();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await cartController.getAllCarts();
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

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
