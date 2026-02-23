
import UserService from "../service/userService.js";
const userService = new UserService();


class UserController {
    /* constructor() {
      this.userService = new UserService(); // otra opcion
    } */

    sendEmail = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ status: "error", message: "Email is required", });
            }

            const result = await userService.send_reset_email(email);

            res.status(200).json({
                status: 'success', message: 'Si el correo electrónico existe, se envió un enlace de restablecimiento', payload: result
            });

        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({
                status: 'error', message: 'Failed to send email',
            });
        }
    };

    send_password_reset = async (req, res) => {
        const { token } = req.query;
        console.log('Token recibido:', token);

        if (!token) {
            return res.status(400).send({ status: 'error', message: 'Token no proporcionado' });
        }

        try {
            res.status(200).send({ status: 'success', message: 'Token válido, muestra la página de restablecimiento de contraseña.' });
        } catch (error) {
            console.error('Error al verificar el token:', error.message);
            res.status(500).send({ status: 'error', message: 'Error al verificar el token.' });
        }

    }

    reset_password = async (req, res) => {
        try {
            const { token, password } = req.body;

            if (!token || !password) {
                return res.status(400).send({ status: 'error', message: 'Token o password no proporcionado' });
            }

            const result = await userService.resetPassword(token, password);

            res.status(200).send({ status: 'success', message: 'Password actualizada', payload: result });
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error.message);

            if (
                error.message.includes('expirado') ||
                error.message.includes('misma')
            ) {
                return res.status(400).send({ status: 'error', message: error.message });
            }

            return res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
        }
    }



    getAll = async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    getById = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await userService.getUserById(uid);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(404).json({ status: 'error', message: error.message });
        }
    };

    register = async (req, res) => {
        try {
            const result = await userService.register(req.body);
            res.status(201).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    login = async (req, res) => {
        const { email, password } = req.body;

        try {
            const token = await userService.login(email, password);


            res.cookie('auth', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax'
            }).json({
                status: 'success'
                , message: 'Login exitoso',
                token
            })
        } catch (error) {
            res.status(401).json({ status: 'error', message: error.message });
        }
    };

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await userService.deleteUser(uid);
            res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente', payload: result });
        } catch (error) {
            res.status(404).json({ status: 'error', message: error.message });
        }
    };

    current = async (req, res) => {
        res.send({
            user: req.user
        })
    }


    logout = async (req, res) => {
        res.clearCookie('auth');
        res.status(200).json({ status: 'success',
            message: 'Sesión cerrada correctamente'
        });
    };

}

export default UserController;
