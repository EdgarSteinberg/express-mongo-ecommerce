import mongoose from "mongoose";
import ProductDao from "../dao/productDao.js";

const productDao = new ProductDao();

class ProductController {

    async getAllProducts() {
        try {
            return await productDao.getAllProductDao().lean();
        } catch (error) {
            throw new Error("Error al buscar los productos");
        }
    }

    async getProductById(pid) {
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error("El PID del producto no es válido");
        }

        try {
            const product = await productDao.getProductByIdDao(pid);

            if (!product) {
                throw new Error(`No se encontró el producto con ID: ${pid}`);
            }
            return product;
        } catch (error) {
            throw new Error(`Error al buscar el producto con PID: ${pid}`);
        }
    }

    async createProduct(product) {
        const { title, description, code, price, stock, category, image } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error("Todos los campos son obligatorios");
        }

        try {
            return await productDao.createProductDao({
                title,
                description,
                code,
                price,
                stock,
                category,
                image
            });
        } catch (error) {
            console.log(error.message);
            throw new Error("Error al crear el producto");
        }
    }

    async updatedProduct(pid, updated) {
        await this.getProductById(pid);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        try {
            return await productDao.updatedProductDao(pid, updated);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Error al actualizar el producto con PID: ${pid}`);
        }
    }

    async deleteProduct(pid) {
        await this.getProductById(pid);

        try {
            return await productDao.deleteProductDao(pid);
        } catch (error) {
            throw new Error(`Error al eliminar el producto con PID: ${pid}`);
        }
    }
}

export default ProductController;
