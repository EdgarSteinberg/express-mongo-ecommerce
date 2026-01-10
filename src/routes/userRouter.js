import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";

const router = Router();
const userController = new UserController();

router.get('/current', passport.authenticate("jwt", {session: false}), userController.current);
router.get('/', userController.getAll);
router.get('/:uid', userController.getById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete('/:uid', userController.deleteUser);

export default router;
