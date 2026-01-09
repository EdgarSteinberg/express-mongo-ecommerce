import { Router } from "express";
import CartController from "../controllers/cartController.js";

const router = Router();
const cartController = new CartController();

//Buscar todos los carritos
router.get('/', cartController.getAllCarts);
// Buscar carrito por su CID
router.get('/:cid', cartController.getCartById);
router.post('/', cartController.createCart);
// Agregar producto al carrito
router.post('/:cid/product/:pid', cartController.addProductInCart);
// Remover producto del carrito
router.delete('/:cid/product/:pid', cartController.removeProductInCart);
// Actualizar la cantidad del producto
router.put('/:cid/product/:pid', cartController.updatedProductQuantity);
router.put('/:cid', cartController.updateCart);
// Remover carrito
router.delete('/:cid', cartController.deleteCart);

export default router;
