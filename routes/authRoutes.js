import express from "express";
import { deleteUser, register, login } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route for any logged-in user
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        user: req.user
    });
});

router.delete("/users/:id", deleteUser); // تأكد إنك ضايف حماية الـ Admin هنا لو حابب

// Protected route for Admins only
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
    res.json({
        message: "Welcome Admin! You have access to sensitive data."
    });
});

export default router;