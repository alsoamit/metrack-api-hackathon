/* eslint-disable prefer-const */
import mongoose from "mongoose";
import courseService from "../services/course-service";
import APIResponse from "../helpers/APIResponse";
import discussionService from "../services/discussion-service";
import userService from "../services/user-service";
import projectService from "../services/project-service";

class CourseController {
    async addCourse(req, res) {
        let {
            name,
            channel,
            description,
            thumbnail,
            video,
            channelImage,
            tags,
            level,
            category,
            domain,
            aboutChannel,
        } = req.body;

        try {
            let course = await courseService.findCourse({ name, channel });
            if (course) {
                return APIResponse.validationError(
                    res,
                    "course already exists"
                );
            }

            tags = tags.split(",");

            course = await courseService.createCourse({
                name,
                channel,
                description,
                thumbnail,
                video,
                channelImage,
                tags,
                level,
                category,
                domain,
                aboutChannel,
            });

            const discussion = await discussionService.create({
                courseId: course._id,
            });

            course.discussionId = discussion._id;
            course.save();

            return APIResponse.successResponseWithData(
                res,
                course.toObject(),
                "course created"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async editCourse(req, res) {
        let {
            id,
            name,
            channel,
            description,
            thumbnail,
            video,
            channelImage,
            tags,
            level,
        } = req.body;

        try {
            let course = await courseService.findCourse({ _id: id });
            if (typeof tags === "string") {
                tags = tags.split(",");
            }
            course = await courseService.updateCourse(id, {
                name,
                channel,
                description,
                thumbnail,
                video,
                channelImage,
                tags,
                level,
            });

            return APIResponse.successResponseWithData(
                res,
                course,
                "course created"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async deleteCourse(req, res) {
        const { id } = req.params;

        try {
            const course = await courseService.deleteCourse(id);
            return APIResponse.successResponseWithData(
                res,
                course,
                "course deleted"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res, err);
        }
    }

    async getAllCourses(req, res) {
        try {
            const courses = await courseService.getAllCourses();
            return APIResponse.successResponseWithData(res, courses);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async getCourseById(req, res) {
        const { id } = req.params;

        try {
            const course = await courseService.findCourse({ _id: id });

            if (!course) {
                return APIResponse.notFoundResponse(res, "Not Found");
            }
            let projects = await projectService.getMany({
                courseId: course._id,
            });
            if (!projects) {
                projects = [];
            }
            const data = {
                ...course.toObject(),
                projects,
            };
            return APIResponse.successResponseWithData(res, data);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async getPublishedCourses(req, res) {
        const { category } = req.query;

        try {
            let courses = await courseService.getAllCourses();
            courses = courses.filter((e) => e.isPublished);
            courses = courses.filter(
                (e) => e.category.toLowerCase() === category.toLowerCase()
            );
            return APIResponse.successResponseWithData(res, courses);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async publishCourse(req, res) {
        const { id } = req.params;

        try {
            const course = await courseService.findCourse({ _id: id });
            course.isPublished = true;
            await course.save();
            return APIResponse.successResponseWithData(
                res,
                course,
                "Course Published"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async unPublishCourse(req, res) {
        const { id } = req.params;

        try {
            const course = await courseService.findCourse({ _id: id });
            course.isPublished = false;
            await course.save();
            return APIResponse.successResponseWithData(
                res,
                course,
                "Course Published"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async enrollCourse(req, res) {
        const { id } = req.params;

        const { _id } = req.user;

        try {
            const course = await courseService.findCourse({ _id: id });
            const user = await userService.findUser({ _id });

            const check = course.students.find((e) => e === _id);

            if (check) {
                return APIResponse.validationError(res, "Already Enrolled");
            }

            user.courseEnrolled.push(id);
            course.students.push(_id);
            await course.save();
            await user.save();
            return APIResponse.successResponseWithData(
                res,
                user,
                "Enrolled 🎉"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async getEnrolledCourses(req, res) {
        const { user } = req;
        try {
            const courses = await courseService.getAllCourses({
                students: mongoose.Types.ObjectId(user._id),
            });
            return APIResponse.successResponseWithData(res, courses);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }
}

export default new CourseController();
