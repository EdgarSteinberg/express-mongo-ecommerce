import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { uploader } from "../utils/multer.js";

const router = Router();
const productController = new ProductController();

// GET all
router.get('/', productController.getAllProducts);

// GET categories
router.get('/categories', productController.getAllCategories);

// GET by ID
router.get('/:pid', productController.getProductById);

// POST create
router.post('/', uploader.single("mainImage"), productController.createProduct);

// PUT update
router.put('/:pid', productController.updatedProduct);

// DELETE
router.delete('/:pid', productController.deleteProduct);

export default router;
