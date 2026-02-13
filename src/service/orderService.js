import mongoose from "mongoose";

import OrderDao from "../dao/orderDao.js";
const orderService = new OrderDao();

import UserDao from "../dao/userDao.js";
const userService = new UserDao();

import CartDao from "../dao/cartDao.js";
const cartService = new CartDao();

class OrderService {

    async getAllOrders() {
        try {
            return await orderService.getOrdersDao();
        } catch (error) {
            throw new Error(`Error al obtener los productos ${error.message}`);

        }
    }

    async getOrderById(oid) {
        try {
            const result = await orderService.getByIdDao(oid);
            if (!result) {
                throw new Error(`Error al obtener los producto con ID: ${oid}, `)
            }
            return result;
        } catch (error) {
            throw new Error(`Error al obtener los producto con ID: ${oid}, ${error.message}`);

        }
    }

    async getOrdersByUserDao(uid) {

        if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
            throw new Error("ID de usuario inválido");
        }

        const user = await userService.getUserByIdDao(uid);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        try {
            return await orderService.getOrdersByUserDao(user._id);
        } catch (error) {
            throw new Error("Error al obtener todas las ordenes");
        }
    }

    async createOrder(order) {
        try {
            const code = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const user = await userService.getUserByEmailDao(order.email);
            if (!user) throw new Error("Usuario no encontrado");

            const cart = await cartService.getCartByIdDao(order.cart);
            if (!cart) throw new Error("Carrito no encontrado");

            const amount = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

            const result = await orderService.createDao({
                code,
                amount,
                purchaser: user._id,
                cart: cart.products.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                }))
            });

            await cartService.clearCart(cart._id);
            return result;

        } catch (error) {
            throw new Error(`Error al generar la orden: ${error.message}`);
        }
    }



    async updateOrder(oid, updated) {
        const orderId = await this.getOrderById(oid);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        try {
            const result = await orderService.updateByIdDao(orderId._id, updated);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar el producto con ID:${oid}, ${error.message}`);
        }
    }

    async deleteOrder(oid) {
        const orderId = await this.getOrderById(oid);

        try {
            const result = await orderService.deleteByIdDao(orderId._id);
            result;
        } catch (error) {
            throw new Error(`Error al obtener los producto con ID: ${oid}, ${error.message}`);
        }
    }
}

export default OrderService;