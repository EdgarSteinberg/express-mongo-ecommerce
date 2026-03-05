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


    async deleteUserDao(uid) {
        const result = await userModel.findByIdAndDelete(uid);
        if (!result) {
            throw new Error(`Usuario no encontrado`);
        }
        return result;
    }

    async updateUserRoleByIdDao(uid, role) {
        const result = await userModel.findByIdAndUpdate(
            uid,
            { role },
            { new: true, runValidators: true } //Porque por defecto findOneAndUpdate no corre validaciones del schema.
        )
        return result
    }

    async lastConnectionDao(uid) {
        const result = await userModel.findByIdAndUpdate(
            uid,
            { last_connection: new Date() },
            { new: true }
        );
        return result;
    }
}

export default UserDao;

/* 🔎 ¿Por qué { new: true }?

Porque si no lo ponés, Mongoose te devuelve el documento antes del update.

Con { new: true } te devuelve el documento actualizado. */