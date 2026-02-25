import { Router } from "express";
import CartController from "../controllers/cartController.js";
import passport from "passport";

const router = Router();
const cartController = new CartController();

router.use(passport.authenticate('jwt', { session: false })); 

router.get('/', cartController.getAllCarts);

router.get('/:cid', cartController.getCartById);

router.post('/', cartController.createCart);

router.post('/:cid/product/:pid', cartController.addProductInCart); // Agregar producto al carrito

router.delete('/:cid/product/:pid', cartController.removeProductInCart); // Remover producto del carrito

router.put('/:cid/product/:pid', cartController.updatedProductQuantity); // Actualizar la cantidad del producto

router.put('/:cid', cartController.updateCart);

router.delete('/:cid', cartController.deleteCart); // Remover carrito

export default router;
