import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { uploader } from "../utils/multer.js";

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

// GET categories/ID
router.get('/categories', async (req, res) => {
    const { category } = req.query;

    try {
        // 👉 Si viene category, devolvemos productos
        if (category) {
            const result = await productController.getProductCategory(category);
            return res.status(200).json({ status: 'success', payload: result });
        }

        // 👉 Si no viene category, devolvemos las categorías
        const result = await productController.getAllCategories();
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
router.post('/', uploader.single("mainImage"), async (req, res) => {

    const mainImage = req.file ? req.file.filename : [];


    try {
        const result = await productController.createProduct({
            ...req.body,
            mainImage
        });

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
