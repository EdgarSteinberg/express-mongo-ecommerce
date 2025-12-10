import { Router } from "express";
import ProductController from "../controllers/productController.js";

const productController = new ProductController();
const router = Router();

// GET all
router.get('/', async (req, res) => {
    try {
        const result = await productController.getAllProducts();
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET by ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await productController.getProductById(pid);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const result = await productController.createProduct(req.body);
        res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT update
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updated = req.body;
    try {
        const result = await productController.updatedProduct(pid, updated);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await productController.deleteProduct(pid);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
