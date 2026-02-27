import mongoose from "mongoose";
import { Resend } from "resend";
import ProductDao from "../dao/productDao.js";

const resend = new Resend(process.env.RESEND_API_KEY); //RESEND

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
        const { title, shortDescription, longDescription, price, stock, brand, category, discount, tags, mainImage, owner } = product;

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
                mainImage,
                owner
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
        const product = await this.getProductById(pid);

        await productDao.deleteProductDao(pid);

        // Solo notifico si el dueño es premium (por ejemplo)
        /* if (user.role === 'premium') {
            await this.sendEmailDelete(product.owner, product);
        } */
        await this.sendEmailDelete(product.owner, product);
        return product;
    }

    async sendEmailDelete(email, product) {
        await resend.emails.send({
            from: "ApiE-commerce <onboarding@resend.dev>",
            to: email,
            subject: "Baja de producto",
            html: `
            <h2>Producto eliminado</h2>
            <p>Hola,</p>
            <p>Te informamos que el siguiente producto fue eliminado de la plataforma:</p>
            <ul>
                <li><strong>Nombre:</strong> ${product.title}</li>
                <li><strong>ID:</strong> ${product._id}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <p>Si no realizaste esta acción, contacta con soporte.</p>
            <br/>
            <p>— Equipo E-commerce</p>
                `
        });
    }
}

export default ProductService;
