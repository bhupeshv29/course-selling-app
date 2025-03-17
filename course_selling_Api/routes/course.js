import { Router } from "express";
import { userMiddleware } from "../middleware/user.js";
import { PurchaseModel, CourseModel } from "../db.js";

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    try {
        const userId = req.userId;
        const courseId = req.body.courseId;

        // Validate courseId
        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }

        // Check if course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Check if user already purchased this course
        const existingPurchase = await PurchaseModel.findOne({
            userId,
            courseId
        });

        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course"
            });
        }

        const purchase = await PurchaseModel.create({
            userId,
            courseId
        });

        res.status(201).json({
            message: "Course purchased successfully",
            purchase
        });
    } catch (error) {
        console.error("Purchase error:", error);
        res.status(500).json({
            message: "Internal server error while processing purchase"
        });
    }
});

courseRouter.get("/preview", async function(req, res) {
    try {
        const courses = await CourseModel.find({});

        if (!courses.length) {
            return res.status(404).json({
                message: "No courses found"
            });
        }

        res.json({
            message: "Courses retrieved successfully",
            courses
        });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({
            message: "Internal server error while fetching courses"
        });
    }
});

export { courseRouter };