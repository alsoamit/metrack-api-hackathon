import { Types } from "mongoose";
import APIResponse from "../helpers/APIResponse";
import projectService from "../services/project-service";

class ProjectController {
  async addProject(req, res) {
    try {
      const { title, courseId, description, url, githubUrl, webUrl, tags } =
        req.body;
      const {user} = req;
      const project = await projectService.create({
        title,
        userId: user._id,
        courseId,
        description,
        thumbnail: url,
        githubUrl,
        webUrl,
        tags,
      });
      return APIResponse.successResponseWithData(res, project);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res, err);
    }
  }

  async addFeedback(req, res) {
    try {
      const { message, id } = req.body;
      const {user} = req;
      const project = await projectService.getOne({ _id: id });
      if (!project) {
        return APIResponse.notFoundResponse(res, "project not found");
      }
      // temporary (for projects that don't have feedback array in their path yet)
      if (!project.feedbacks) {
        project.feedbacks = [];
        project.save();
      }
      project.feedbacks.push({
        message,
        user: user._id,
      });
      project.save();
      return APIResponse.successResponseWithData(res, req.body);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res, err);
    }
  }

  async getProjects(req, res) {
    console.log("getting projects");
    try {
      const projects = await projectService.getMany({
        userId: Types.ObjectId(req.user._id),
      });
      return APIResponse.successResponseWithData(res, projects);
    } catch (err) {
      return APIResponse.errorResponse(res, err);
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return APIResponse.validationError(res, "id is required");
      }
      const deletedProject = await projectService.deleteOne({ _id: id });
      if (!deletedProject) {
        return APIResponse.notFoundResponse(res, "project not found");
      }
      return APIResponse.successResponseWithData(
        res,
        { id },
        "project deleted"
      );
    } catch (err) {
      return APIResponse.errorResponse(res, err);
    }
  }
}

export default new ProjectController();
