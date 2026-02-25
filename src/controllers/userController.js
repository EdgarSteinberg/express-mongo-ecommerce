
import UserService from "../service/userService.js";
const userService = new UserService();

import logger from "../loggers/logger.js";

class UserController {
    /* constructor() {
      this.userService = new UserService(); // otra opcion
    } */

    sendEmail = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                logger.warn('Intento de enviar email sin proporcionar correo');
                return res.status(400).json({ status: "error", message: "Email is required", });
            }

            const result = await userService.send_reset_email(email);
            logger.info(`Correo de restablecimiento enviado a ${email}`);
            res.status(200).json({
                status: 'success', message: 'Si el correo electrónico existe, se envió un enlace de restablecimiento', payload: result
            });

        } catch (error) {
            logger.error(`Error enviando email: ${error.message}`);
            res.status(500).json({
                status: 'error', message: 'Failed to send email',
            });
        }
    };

    send_password_reset = async (req, res) => {
        const { token } = req.query;
        logger.info(`Token recibido: ${token}`);

        if (!token) {
            logger.warn(`Token no recibido`);
            return res.status(400).send({ status: 'error', message: 'Token no proporcionado' });
        }

        try {
            res.status(200).send({ status: 'success', message: 'Token válido, muestra la página de restablecimiento de contraseña.' });
        } catch (error) {
            logger.error(`Error al verificar el token: ${error.message}`);
            res.status(500).send({ status: 'error', message: 'Error al verificar el token.' });
        }
    }

    reset_password = async (req, res) => {
        try {
            const { token, password } = req.body;

            if (!token || !password) {
                logger.warn('Token no recibido o falta password');
                return res.status(400).send({ status: 'error', message: 'Token o password no proporcionado' });
            }

            const result = await userService.resetPassword(token, password);

            logger.info(`Password actualizada correctamente para token: ${token}`);
            res.status(200).send({ status: 'success', message: 'Password actualizada', payload: result });

        } catch (error) {
            logger.error(`Error al actualizar la contraseña: ${error.message}`);

            if (error.message.includes('expirado') || error.message.includes('misma')) {
                return res.status(400).send({ status: 'error', message: error.message });
            }

            return res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    getAll = async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            logger.info(`Todos los usuarios obtenidos. Cantidad: ${result.length}`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al obtener usuarios: ${error.message}`);
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    getById = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await userService.getUserById(uid);
            logger.info(`Usuario obtenido con UID: ${uid}`);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al obtener el usuario ${uid}: ${error.message}`);
            res.status(404).json({ status: 'error', message: error.message });
        }
    };

    register = async (req, res) => {
        try {
            const result = await userService.register(req.body);
            logger.info(`Usuario registrado correctamente: UID=${result._id}, email=${result.email}`);
            res.status(201).json({ status: 'success', payload: result });
        } catch (error) {
            logger.error(`Error al registrar el usuario: ${error.message}`);
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    login = async (req, res) => {
        const { email } = req.body;

        try {
            const token = await userService.login(email, req.body.password);

            logger.info(`Login exitoso para el usuario: ${email}`);

            res.cookie('auth', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax'
            }).json({
                status: 'success',
                message: 'Login exitoso',
                token
            });
        } catch (error) {

            if (error.message === "Credenciales invalidas") {
                logger.warn(`Intento de login fallido - email: ${email}`);
                return res.status(401).json({ status: 'error', message: error.message });
            }

            logger.error(`Error interno en login para ${email}: ${error.message}`);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    };

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await userService.deleteUser(uid);
            logger.info(`Usuario eliminado correctamente: UID=${uid}`);
            res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente', payload: result });
        } catch (error) {
            logger.error(`Error al eliminar el usuario ${uid}: ${error.message}`);
            res.status(404).json({ status: 'error', message: error.message });
        }
    };

    current = (req, res) => {
        logger.info(`Usuario consultó su sesión: UID=${req.user?._id || 'desconocido'}`);
        res.send({
            user: req.user
        });
    }

    logout = (req, res) => {
        logger.info(`Usuario cerró sesión: UID=${req.user?._id || 'desconocido'}`);
        res.clearCookie('auth');
        res.status(200).json({
            status: 'success',
            message: 'Sesión cerrada correctamente'
        });
    }

}

export default UserController;
