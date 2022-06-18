import UserModel from "../models/user-model";

class UserService {
  async findUser(filter) {
    try {
      const users = await UserModel.findOne(filter);
      return users;
    } catch (err) {
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
}

export default new UserService();
