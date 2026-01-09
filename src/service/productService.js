import mongoose from "mongoose";
import ProductDao from "../dao/productDao.js";

const productDao = new ProductDao();

class ProductService {

    async getAllProducts() {
        try {
            return await productDao.getAllProductDao();
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
    async getAllCategories() {
        try {
            return await productDao.getAllCategoriesDao()
        } catch (error) {
            throw new Error(`Error al obtener las categorias`)
        }
    }

    async getProductCategory(category) {
        if (!category) {
            throw new Error(`Falta la categoria del producto`);
        }

        const normalizedCategory = category.toLowerCase().trim();

        try {
            const result = await productDao.getProductCategoryDao(normalizedCategory);

            if (result.length === 0) {
                throw new Error(`No existen productos en la categoría ${normalizedCategory}`);
            }

            return result;
        } catch (error) {
            throw new Error(`Error al obtener la categoria ${normalizedCategory}`);
        }
    }

    async createProduct(product) {
        const { title, shortDescription, longDescription, price, stock, brand, category, discount, tags, mainImage } = product;

        if (!title || !shortDescription || !longDescription || !price || !stock || !brand || !category) {
            throw new Error("Todos los campos obligatorios deben completarse.");
        }

        try {
            return await productDao.createProductDao({
                title,
                shortDescription,
                longDescription,
                price,
                stock,
                brand,
                category,
                discount,
                tags,
                mainImage
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

export default ProductService;
