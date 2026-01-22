import { Resend } from "resend";

import jwt from "jsonwebtoken";
import { comparePassword, createHash } from "../utils/cryptoUtil.js";

import UserDao from "../dao/userDao.js";
const userDao = new UserDao();

import CartService from "../service/cartService.js";
const cartService = new CartService();

const resend = new Resend(process.env.RESEND_API_KEY); //RESEND

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
            const cartId = await cartService.createCart();

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
                delete user.password;
                return jwt.sign(user, "coderSecret", { expiresIn: "2h" });
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
                await cartService.deleteCart(user.cart);
            }

            // 3️⃣ Eliminás el usuario
            const result = await userDao.deleteUser(uid);

            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }

    async send_reset_email(email) {
        // Buscar usuario
        const user = await userDao.getUserByEmailDao(email);
        if (!user) {
            return;
        }
        //Generar token con expiración
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Token reset:", token);

        //Link de reset
        /* const resetLink = `http://localhost:8080/api/users/reset-password?token=${token}`; */
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        // 4️⃣ Enviar email con Resend
        await resend.emails.send({
            from: "Edgar <onboarding@resend.dev>",
            to: email,
            subject: "Recuperación de contraseña",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                  <h1>Recuperación de contraseña</h1>
                  <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                  <p>Si no fuiste vos, ignorá este correo.</p>
                  <a href="${resetLink}" style="
                      display:inline-block;
                      padding:12px 20px;
                      background:#4f46e5;
                      color:white;
                      text-decoration:none;
                      border-radius:6px;
                      margin-top:10px;
                  ">
                      Restablecer contraseña
                  </a>
                  <p>Este enlace vence en 1 hora.</p>
              </div>
          `,
        });

        return token;
    }


    /*  async resetPassword(token, newPassword) {
         try {
             const data = jwt.verify(token, process.env.JWT_SECRET);
             const { email } = data;
             const user = await userDao.getUserByEmailDao(email);
 
             if (!email) {
                 throw new Error('La nueva contraseña no puede ser la misma que la anterior');
             }
 
             const hashedPassword = await createHash(newPassword);
             await userDao.updatedDao(user._id, { password: hashedPassword });
         } catch (error) {
             if (error instanceof jwt.TokenExpiredError) {
                 throw new Error('El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
             } else {
                 throw error;
             }
         }
     } */

    async resetPassword(token, newPassword) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            const { email } = data;

            const user = await userDao.getUserByEmailDao(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isSamePassword = await comparePassword(user, newPassword,);
            if (isSamePassword) {
                throw new Error('La nueva contraseña no puede ser la misma que la anterior');
            }

            const hashedPassword = await createHash(newPassword);
            await userDao.updatedDao(user._id, { password: hashedPassword });

        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error(
                    'El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.'
                );
            }
            throw error;
        }
    }


}

export default UserService;