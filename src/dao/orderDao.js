import orderModel from "../models/orderModels.js";

class OrderDao {

    async getOrdersDao() {
        return await orderModel.find();
    }

    async getOrdersByUserDao(uid) {
        return await orderModel
            .find({ purchaser: uid })
            .populate('purchaser')
            .populate('cart.product')
            .sort({ purchaseDateTime: -1 });
    }

    async getByIdDao(oid) {
        return await orderModel.findById(oid)
            .populate('purchaser')
            .populate('cart.product');
    }

    async createDao(order) {
        return await orderModel.create(order);
    }

    async updateByIdDao(oid, updated) {
        return await orderModel.findByIdAndUpdate(oid, updated, { new: true });
    }

    async deleteByIdDao(oid) {
        return await orderModel.findByIdAndDelete(oid);
    }
}


export default OrderDao;