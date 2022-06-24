import CourseService from "../services/course-service";
import APIResponse from "../helpers/APIResponse";
import discussionService from "../services/discussion-service";

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
    } = req.body;

    if (
      !name ||
      !channel ||
      !description ||
      !thumbnail ||
      !video ||
      !channelImage ||
      !tags ||
      !level
    ) {
      return APIResponse.unauthorizedResponse(res, "All Fields are required");
    }

    try {
      let course = await CourseService.findCourse({ name, channel });
      if (course) {
        return APIResponse.validationError(res, "course already exists");
      }

      tags = tags.split(",");

      course = await CourseService.createCourse({
        name,
        channel,
        description,
        thumbnail,
        video,
        channelImage,
        tags,
        level,
      });

      let discussion = await discussionService.create({
        courseId: course._id,
      });

      course.discussionId = discussion._id;
      course.save();

      console.log(discussion, course);
      return APIResponse.successResponseWithData(res, course, "course created");
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

    if (
      !name ||
      !channel ||
      !description ||
      !thumbnail ||
      !video ||
      !channelImage ||
      !tags ||
      !level
    ) {
      return APIResponse.unauthorizedResponse(res, "All Fields are required");
    }

    try {
      let course = await CourseService.findCourse({ _id: id });
      {
        if (typeof tags == "string") tags = tags.split(",");
      }

      course = await CourseService.updateCourse(id, {
        name,
        channel,
        description,
        thumbnail,
        video,
        channelImage,
        tags,
        level,
      });

      return APIResponse.successResponseWithData(res, course, "course created");
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async deleteCourse(req, res) {
    const { id } = req.params;

    try {
      let course = await CourseService.deleteCourse(id);
      return APIResponse.successResponseWithData(res, course, "course deleted");
    } catch (err) {
      return APIResponse.errorResponse(err);
    }
  }

  async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getAllCourses();
      return APIResponse.successResponseWithData(res, courses);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async getCourseById(req, res) {
    const { id } = req.params;

    try {
      const course = await CourseService.findCourse({ _id: id });

      if (!course) {
        return APIResponse.notFoundResponse(res);
      }

      return APIResponse.successResponseWithData(res, course);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async getPublishedCourses(req, res) {
    try {
      let courses = await CourseService.getAllCourses();
      courses = courses.filter((e) => e.isPublished);
      return APIResponse.successResponseWithData(res, courses);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async publishCourse(req, res) {
    const { id } = req.params;

    try {
      let course = await CourseService.findCourse({ _id: id });
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
      let course = await CourseService.findCourse({ _id: id });
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
}

export default new CourseController();
