import UserModel from "../models/user-model";

class UserService {
    async findUser(filter) {
        try {
            const users = await UserModel.findOne(filter);
            return users;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getAllUser(filter) {
        const user = await UserModel.find(filter);
        return user;
    }

    async createUser(data) {
        const user = await UserModel.create(data);
        return user;
    }

    async updateUser(filter, data) {
        return UserModel.updateOne(filter, data, { new: true });
    }

    async deleteOne(filter) {
        return UserModel.deleteOne(filter);
    }
}

export default new UserService();
