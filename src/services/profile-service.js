import ProfileModel from "../models/profile-model";

class ProfileService {
    async findOne(filter) {
        try {
            const users = await ProfileModel.findOne(filter);
            return users;
        } catch (err) {
            return err;
        }
    }

    async addOne(data) {
        console.log(data);
        return ProfileModel.create(data);
    }

    async updateOne(filter, data) {
        return ProfileModel.updateOne(filter, data, { new: true });
    }
}

export default new ProfileService();
