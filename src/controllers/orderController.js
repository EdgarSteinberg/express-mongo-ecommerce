import OrderService from "../service/orderService.js";

const orderService = new OrderService();

import logger from "../loggers/logger.js";

class OrderController {

    getAllOrders = async (req, res) => {
        try {
            const result = await orderService.getAllOrders();
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    getOrderById = async (req, res) => {
        const { oid } = req.params;

        try {
            const result = await orderService.getOrderById(oid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(404).json({ status: 'error', message: error.message });
        }
    };


    getOrdersByUser = async (req, res) => {
        const uid = req.user._id;

        try {
            const result = await orderService.getOrdersByUserDao(uid);
            logger.info(`Usuario ${uid} consultó ${result.length} órdenes`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error usuario no encontrado ${error.message}`)
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    createOrder = async (req, res) => {
        try {
            const result = await orderService.createOrder(req.body);
            logger.info(`Orden creada correctamente - ID: ${result._id}`);
            res.status(201).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al generar la orden ${error.message}`);
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    updateOrder = async (req, res) => {
        const { oid } = req.params;

        try {
            const result = await orderService.updateOrder(oid, req.body);
            logger.info(`Orden ${oid} actualizada`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error en la actualizacion de la orden ${oid}`);
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    deleteOrder = async (req, res) => {
        const { oid } = req.params;

        try {
            const result = await orderService.deleteOrder(oid);
            logger.info(`Orden ${oid} eliminada`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al eliminar la orden ${error.message}`);
            res.status(404).json({ status: 'error', message: error.message });
        }
    };
}


export default OrderController;