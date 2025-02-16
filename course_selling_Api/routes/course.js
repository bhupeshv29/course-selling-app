import { Router } from "express";
import { userMiddleware } from "../middleware/user.js";
import { PurchaseModel, CourseModel } from "../db.js";

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    await PurchaseModel.create({
        userId,
        courseId
    });

    res.json({
        message: "You have successfully bought the course"
    });
});

courseRouter.get("/preview", async function(req, res) {
    const courses = await CourseModel.find({});

    res.json({
        courses
    });
});


export { courseRouter };