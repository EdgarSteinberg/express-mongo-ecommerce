
import UserService from "../service/userService.js";
const userService = new UserService();

class UserController {
    /* constructor() {
      this.userService = new UserService(); // otra opcion
    } */

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

            res.cookie("auth", token, { maxAge: 60 * 60 * 1000 }).json(
                {
                    status: 'success'
                    , message: 'Login exitoso',
                    token
                });
                
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
}

export default UserController;
