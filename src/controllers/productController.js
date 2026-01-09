import ProductService from "../service/productService.js";

const productService = new ProductService();

class ProductController {

    getAllProducts = async (req, res) => {
        try {
            const result = await productService.getAllProducts();
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    getAllCategories = async (req, res) => {
        const { category } = req.query;

        try {
            // 👉 Si viene category, devolvemos productos
            if (category) {
                const result = await productService.getProductCategory(category);
                return res.status(200).json({ status: 'success', payload: result });
            }

            // 👉 Si no viene category, devolvemos las categorías
            const result = await productService.getAllCategories();
            res.status(200).json({ status: 'success', payload: result });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    getProductById = async (req, res) => {
        const { pid } = req.params;
        try {
            const result = await productService.getProductById(pid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    createProduct = async (req, res) => {
        const mainImage = req.file ? req.file.filename : [];

        try {
            const result = await productService.createProduct({
                ...req.body,
                mainImage
            });

            res.status(201).json({ status: 'success', payload: result });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    updatedProduct = async (req, res) => {
        const { pid } = req.params;
        const updated = req.body;
        try {
            const result = await productService.updatedProduct(pid, updated);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params;
        try {
            const result = await productService.deleteProduct(pid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default ProductController;
