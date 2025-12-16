import { productModel } from "../models/productsModels.js";

class ProductDao {

    async getAllProductDao() {
        return await productModel.find();
    }

    async getProductByIdDao(pid) {
        const product = await productModel.findById(pid);

        if (!product) {
            throw new Error(`El producto con PID: ${pid} no se encuentra`);
        }

        return product;
    }

    // Obtener todas la categorias
    async getAllCategoriesDao() {
        return await productModel.distinct("category");
    }

    //Obtener el producto por categoria
    async getProductCategoryDao(category) {
        return await productModel.find({category: category});
    }

    async createProductDao(product) {
        return await productModel.create(product);
    }

    async updatedProductDao(pid, productUpdated) {
        const updated = await productModel.findByIdAndUpdate(
            pid,
            productUpdated,
            { new: true }
        );

        if (!updated) {
            throw new Error(`No se pudo actualizar el producto con PID: ${pid}`);
        }

        return updated;
    }

    async deleteProductDao(pid) {
        // verificamos que exista
        await this.getProductByIdDao(pid);

        const deleted = await productModel.deleteOne({ _id: pid });

        return deleted;
    }
}

export default ProductDao;
