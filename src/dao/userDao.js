import userModel from "../models/userModels.js";


class UserDao {

    async getAllUsersDao() {
        return await userModel.find().lean();
    }

    async getUserByIdDao(uid) {
        const result = await userModel
            .findById(uid)
            .lean()
            .populate({
                path: "cart",        // poblamos el carrito del usuario
                populate: {
                    path: "products", // poblamos los productos dentro del carrito
                    model: "products" // asegúrate de que el nombre coincide con tu modelo
                }
            });

        if (!result) {
            throw new Error(`El usuario con ID: ${uid} no existe`);
        }

        return result;
    }


    async getUserByEmailDao(email) {
        return await userModel.findOne({ email }).lean();
    }

    async registerDao(user) {
        return await userModel.create(user);

    }

    async updatedDao(uid, updated) {
        const result = await userModel.findByIdAndUpdate(
            uid,
            updated,
            { new: true }
        )
        return result;
    }


    async deleteUser(uid) {
        const result = await userModel.findByIdAndDelete(uid);
        if (!result) {
            throw new Error(`Usuario no encontrado`);
        }
        return result;
    }
}

export default UserDao;