import { body } from "express-validator";

const common = [
    body("name").not().isEmpty().withMessage("name is required"),
    body("channel")
        .not()
        .isEmpty()
        .withMessage("channel is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("field channel is too long"),
    body("description")
        .not()
        .isEmpty()
        .withMessage("description is required")
        .isLength({ min: 1, max: 2000 })
        .withMessage("description is too long"),
    body("thumbnail")
        .not()
        .isEmpty()
        .withMessage("thumbnail is required")
        .isLength({ min: 1, max: 400 })
        .withMessage("field thumbnail is too long"),
    body("video")
        .not()
        .isEmpty()
        .withMessage("video is required")
        .isLength({ min: 1, max: 400 })
        .withMessage("field video is too long"),
    body("channelImage")
        .not()
        .isEmpty()
        .withMessage("channelImage is required")
        .isLength({ min: 1, max: 400 })
        .withMessage("field channelImage is too long"),
    body("level").not().isEmpty().withMessage("level is required"),
    body("tags")
        .not()
        .isEmpty()
        .withMessage("tags is required")
        .isLength({ min: 1, max: 400 })
        .withMessage("field tags is too long"),
    body("aboutChannel")
        .not()
        .isEmpty()
        .isLength({ min: 1, max: 2000 })
        .withMessage("field aboutChannel is too long")
        .withMessage("aboutChannel is required"),
];

const add = [
    ...common,
    body("category").not().isEmpty().withMessage("category is required"),
    body("domain").not().isEmpty().withMessage("domain is required"),
];

const edit = [...common];

const course = { add, edit };

export default course;
