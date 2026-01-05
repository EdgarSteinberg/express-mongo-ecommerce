import { comparePassword, createHash } from "../utils/cryptoUtil.js";

import UserDao from "../dao/userDao.js";
const userDao = new UserDao();

import CartController from "../controllers/cartController.js";
const cartController = new CartController();

class UserService {
    async getAllUsers() {
        try {
            return await userDao.getAllUsersDao();
        } catch (error) {
            throw new Error(`Error al consultar los usuarios`);
        }
    }

    async getUserById(uid) {
        try {
            const result = await userDao.getUserByIdDao(uid);

            return result;
        } catch (error) {
            throw new Error(`Error al consultar usuario con ID:${uid} ${error.message}`);
        }
    }


    async register(user) {
        const { first_name, last_name, age, email, password, role } = user;

        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error(`Error al registrar el usuario`)
        }

        try {
            const cartId = await cartController.createCart();


            const result = await userDao.registerDao({
                first_name,
                last_name,
                email,
                age,
                role,
                password: createHash(password),
                cart: cartId
            });
            return result;
        } catch (error) {
            throw new Error(`Error al registrar el usuario, ${error.message}`)
        }
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error(`'Credenciales invalidas`);
        }

        try {
            const user = await userDao.getUserByEmailDao(email);

            if (!user) {
                throw new Error(`Credenciales invalidas`);
            }

            if (comparePassword(user, password)) {
                return user;
            }
            throw new Error(`Credenciales invalidas`);
        } catch (error) {
            throw new Error(`Error login ${error.message}`)
        }
    }

    async deleteUser(uid) {
        try {
            // 1️⃣ Buscás el usuario
            const user = await userDao.getUserByIdDao(uid);

            // 2️⃣ Eliminás el carrito si existe
            if (user.cart) {
                await cartController.deleteCart(user.cart);
            }

            // 3️⃣ Eliminás el usuario
            const result = await userDao.deleteUser(uid);

            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }

}

export default UserService;