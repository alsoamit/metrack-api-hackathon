import ProjectModel from "../models/project-model";

class ProjectService {
  async getMany(filter) {
    try {
      const discussion = await ProjectModel.find(filter)
        .sort("date")
        .limit(20)
        .populate("userId", "name")
        .populate("feedbacks.user", "name")
        .lean();
      return discussion;
    } catch (err) {
      return err;
    }
  }

  async getOne(filter) {
    try {
      return await ProjectModel.findOne(filter);
    } catch (err) {
      return err;
    }
  }

  async getOneWithoutPopulation(filter) {
    console.log(filter);
    try {
      const discussion = await ProjectModel.findOne(filter);
      console.log(discussion, "from service");
      return discussion;
    } catch (err) {
      return err;
    }
  }

  async create(data) {
    const project = await ProjectModel.create(data);
    return project;
  }

  async update(filter, data) {
    return await ProjectModel.updateOne(filter, data, { new: true });
  }

  async deleteOne(filter) {
    return await ProjectModel.deleteOne(filter);
  }
}

export default new ProjectService();
