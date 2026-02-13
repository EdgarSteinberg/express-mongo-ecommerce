import OrderService from "../service/orderService.js";

const orderService = new OrderService();


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
            res.status(200).json({ status: 'success', payload: result });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    createOrder = async (req, res) => {
        try {
            const result = await orderService.createOrder(req.body);
            res.status(201).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    updateOrder = async (req, res) => {
        const { oid } = req.params;
        try {
            const result = await orderService.updateOrder(oid, req.body);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    deleteOrder = async (req, res) => {
        const { oid } = req.params;
        try {
            const result = await orderService.deleteOrder(oid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(404).json({ status: 'error', message: error.message });
        }
    };
}


export default OrderController;