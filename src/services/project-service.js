import ProjectModel from "../models/project-model";

class ProjectService {
    async getMany(filter) {
        try {
            const projects = await ProjectModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(20)
                .populate("userId", "name avatar")
                .populate("feedbacks.user", "name avatar")
                .lean();
            return projects;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getOne(filter) {
        try {
            return await ProjectModel.findOne(filter);
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getOneWithoutPopulation(filter) {
        console.log(filter);
        try {
            const projects = await ProjectModel.findOne(filter);
            console.log(projects, "from service");
            return projects;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async create(data) {
        const project = await ProjectModel.create(data);
        return project;
    }

    async update(filter, data) {
        return ProjectModel.updateOne(filter, data, { new: true });
    }

    async deleteOne(filter) {
        return ProjectModel.deleteOne(filter);
    }
}

export default new ProjectService();
