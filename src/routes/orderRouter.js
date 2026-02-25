import { Router } from "express";
import OrderController from "../controllers/orderController.js";
import passport from "passport";
import { handlePolicies } from "../middlewares/handlePolicies.js";

const router = Router();
const orderController = new OrderController();

router.get('/', passport.authenticate("jwt", { session: false }), handlePolicies(['admin']), orderController.getAllOrders);
router.get('/my-orders', passport.authenticate("jwt", { session: false }), handlePolicies(['user', 'admin']), orderController.getOrdersByUser);
router.get('/:oid', passport.authenticate("jwt", { session: false }), handlePolicies(['user','premium','admin']), orderController.getOrderById);
router.post('/', passport.authenticate("jwt", { session: false }), handlePolicies(['user']), orderController.createOrder);
router.put('/:oid', passport.authenticate("jwt", { session: false }), handlePolicies(['admin','user']), orderController.updateOrder);
router.delete('/:oid', passport.authenticate("jwt", { session: false }), handlePolicies(['admin']), orderController.deleteOrder);


export default router;