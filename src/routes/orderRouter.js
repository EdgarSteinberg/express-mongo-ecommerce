import { Router } from "express";
import OrderController from "../controllers/orderController.js";


const router = Router();
const orderController = new OrderController();

router.get('/', orderController.getAllOrders);
router.get('/:oid', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:oid', orderController.updateOrder);
router.delete('/:oid', orderController.deleteOrder);

export default router;