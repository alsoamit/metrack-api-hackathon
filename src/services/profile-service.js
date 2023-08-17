import ProfileModel from "../models/profile-model";

class ProfileService {
    async findOne(filter) {
        try {
            const users = await ProfileModel.findOne(filter).populate("coursesEnrolled");
            return users;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async addOne(data) {
        return ProfileModel.create(data);
    }

    async updateOne(filter, data) {
        return ProfileModel.updateOne(filter, data, { new: true });
    }
}

export default new ProfileService();
