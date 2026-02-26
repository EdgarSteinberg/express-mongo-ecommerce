import ProductService from "../service/productService.js";
import logger from "../loggers/logger.js";

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

        /*  const mainImage = req.file ? req.file.filename : []; */
        const mainImage = req.file ? req.file.filename : null;

        try {
            let tags = [];

            if (req.body.tags) {
                try {
                    tags = JSON.parse(req.body.tags);
                } catch {
                    tags = [];
                }
            }
            const owner = req.user && req.user.role === 'premium' ? req.user.email : 'admin';
            const result = await productService.createProduct({
                ...req.body,
                tags,
                owner,
                mainImage
            });
            logger.info(`Producto creado correctamente por ${owner}`)
            res.status(201).json({ status: 'success', payload: result });

        } catch (error) {
            logger.error(`Error al crear el producto ${error.message}`);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    updatedProduct = async (req, res) => {
        const { pid } = req.params;
        const updated = req.body;


        try {
            const result = await productService.updatedProduct(pid, updated);
            logger.info(`Producto con PID: ${pid} actualizado correctamente`)
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al actualizar ${error.message}`)
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    deleteProduct = async (req, res) => {
        const { pid } = req.params;

        try {
            const user = req.user;
            const product = await productService.getProductById(pid);

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Admin
            if (user.role === 'admin') {
                const result = await productService.deleteProduct(pid, user);
                return res.status(200).json({ status: 'success', payload: result });
            }

            // Premium
            if (user.role === 'premium' && product.owner === user.email) {
                const result = await productService.deleteProduct(pid, user);
                return res.status(200).json({ status: 'success', payload: result });
            }

            return res.status(403).json({ message: 'No autorizado' });

        } catch (error) {
            logger.error(`Error al eliminar el producto ${error.message}`);
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
}

export default ProductController;
