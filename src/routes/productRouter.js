import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { uploader } from "../utils/multer.js";
import { handlePolicies, verifyToken } from "../utils/cryptoUtil.js";

const router = Router();
const productController = new ProductController();

/* passport.authenticate("jwt", { session: false }) es lo mismo que verifyToken */

// GET all
router.get('/', productController.getAllProducts);

// GET categories
router.get('/categories', productController.getAllCategories);

// GET by ID
router.get('/:pid', productController.getProductById);

// POST create
router.post('/', verifyToken, handlePolicies(['admin', 'premium']), uploader.single("mainImage"), productController.createProduct);

// PUT update
router.put('/:pid', verifyToken, handlePolicies(['admin', 'premium']), uploader.single("mainImage"), productController.updatedProduct);

// DELETE
router.delete('/:pid', verifyToken, handlePolicies(['admin', 'premium']), productController.deleteProduct);

export default router;
