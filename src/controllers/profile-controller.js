import mongoose from "mongoose";
import APIResponse from "../helpers/APIResponse";
import profileService from "../services/profile-service";
import userService from "../services/user-service";

class ProfileController {
    async update(req, res) {
        try {
            const { user } = req;
            const { avatar, github, linkedin, about, twitter, website, facebook, instagram, headline } = req.body;
            let profile = await profileService.findOne({ user: user._id });
            if (profile) {
                profile = await profileService.updateOne(
                    { user: user._id },
                    {
                        avatar,
                        github,
                        linkedin,
                        about,
                        twitter,
                        website,
                        facebook,
                        instagram,
                        headline
                    }
                );
            }

            return APIResponse.successResponseWithData(res, profile);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async createProfile(req, res) {
        try {
            const { user } = req;
            let profile = await profileService.findOne({ user: user._id });
            if (!profile) {
                profile = await profileService.addOne({
                    user: mongoose.Types.ObjectId(user._id),
                });
            }

            return APIResponse.successResponseWithData(res, profile);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async getProfile(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.findUser({ username: id });
            if (user) {
                const userId = user._id;
                const profile = await profileService.findOne({ user: userId });
                return APIResponse.successResponseWithData(res, {
                    profile,
                });
            }

            return APIResponse.notFoundResponse(res, "User not found");

        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res, err);
        }
    }

    async checkUsername(req, res) {
        try {
            const { username } = req.body;

            const profile = await userService.findUser({ username });
            if (profile) {
                return APIResponse.notFoundResponse(res, "Username is not available");
            }
            return APIResponse.successResponse(res, "Username is available");
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res, err);
        }
    }
}

export default new ProfileController();
