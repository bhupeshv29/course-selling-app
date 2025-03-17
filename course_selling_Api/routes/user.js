import { Router } from "express";
import { UserModel, PurchaseModel, CourseModel } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "../config.js";
import { userMiddleware } from "../middleware/user.js";

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await UserModel.create({
            email,
            password,
            firstName,
            lastName
        });
        
        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error during signup"
        });
    }
});

userRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({
            email,
            password
        }); 

        if (user) {
            const token = jwt.sign({
                id: user._id,
            }, JWT_USER_PASSWORD);

            res.json({
                message: "Signin successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Internal server error during signin"
        });
    }
});

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    try {
        const userId = req.userId;

        const purchases = await PurchaseModel.find({
            userId,
        });

        let purchasedCourseIds = purchases.map(purchase => purchase.courseId);

        const coursesData = await CourseModel.find({
            _id: { $in: purchasedCourseIds }
        });

        res.json({
            message: "Purchases retrieved successfully",
            purchases,
            coursesData
        });
    } catch (error) {
        console.error("Get purchases error:", error);
        res.status(500).json({
            message: "Internal server error while fetching purchases"
        });
    }
});

export { userRouter };