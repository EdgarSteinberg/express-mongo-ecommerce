import userModel from "../models/userModels.js";


class UserDao {

    async getAllUsersDao() {
        return await userModel.find().lean();
    }

    async getUserByIdDao(uid) {
        const result = await userModel.findById(uid).lean();
        if (!result) {
            throw new Error(`El usuario con ID: ${uid} no existe`);
        }

        return result;
    }

    async getUserByEmailDao(email) {
        const result = await userModel.findOne({ email }).lean();
        if (!result) {
            throw new Error(`Email no encontrado`)
        }

        return result;
    }

    async registerDao(user) {
        return await userModel.create(user);

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