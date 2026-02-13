import { Router } from "express";
import OrderController from "../controllers/orderController.js";
import passport from "passport";


const router = Router();
const orderController = new OrderController();

router.get('/', orderController.getAllOrders);
router.get('/my-orders', passport.authenticate("jwt", { session: false }), orderController.getOrdersByUser);
router.get('/:oid', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:oid', orderController.updateOrder);
router.delete('/:oid', orderController.deleteOrder);

export default router;