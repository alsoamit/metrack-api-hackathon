import CourseService from '../services/course-service'

class CourseController {

    async addCourse(req, res) {
        const { name, channel, description, thumbnail, video, channelImage, tags, level } = req.body;

        if (!name || !channel || !description || !thumbnail || !video || !channelImage || !tags || !level) {
            return APIResponse.unauthorizedResponse(res, "All Fields are required");
        }

        try {
            let course = await CourseService.findCourse({ name, channel })
            if (course) {
                return APIResponse.validationError(res, "course already exists");
            }

            course = await CourseService.createCourse({
                name, channel, description, thumbnail, video, channelImage, tags, level
            })

            return APIResponse.successResponseWithData(res, course, "course created");
        } catch (err) {
            return APIResponse.errorResponse(err);
        }
    }

    async deleteCourse(req, res) {
        const { id } = req.params;

        try {
            let course = await CourseService.deleteCourse(id)
            return APIResponse.successResponseWithData(res, course, "course deleted");
        } catch (err) {
            return APIResponse.errorResponse(err);
        }
    }
}

export default new CourseController();