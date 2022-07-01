import CourseModel from "../models/course-model";

class CourseService {
    async findCourse(filter) {
        console.log(filter);
        try {
            const course = await CourseModel.findOne(filter);
            return course;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getAllCourses(filter) {
        console.log(filter, "from get all courses");
        const courses = await CourseModel.find(filter).limit(100).sort("date");
        console.log({ courses });
        return courses;
    }

    async createCourse(data) {
        return CourseModel.create(data);
    }

    async deleteCourse(id) {
        return CourseModel.findByIdAndDelete(id);
    }

    async updateCourse(id, data) {
        return CourseModel.findByIdAndUpdate(id, data, { new: true });
    }
}

export default new CourseService();
