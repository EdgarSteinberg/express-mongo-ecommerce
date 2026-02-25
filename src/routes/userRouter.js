import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";
/* import { handlePolicies, verifyToken } from "../utils/cryptoUtil.js"; */
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();
const userController = new UserController();

/* passport.authenticate("jwt", { session: false }) es lo mismo que verifyToken */


router.post('/send-reset-email', userController.sendEmail);

router.get('/reset-password', userController.send_password_reset);

router.post('/new-password', userController.reset_password);

router.get('/current', passport.authenticate("jwt", { session: false }), userController.current);

router.get('/', verifyToken, handlePolicies(['admin', 'premium']), userController.getAll);

router.get('/:uid', verifyToken, handlePolicies(['admin', 'premium']), userController.getById);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.delete('/:uid', verifyToken, handlePolicies(['admin', 'premium']), userController.deleteUser);

router.post('/logout', userController.logout);

export default router;
