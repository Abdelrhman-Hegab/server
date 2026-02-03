import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    // التأكد من وجود الـ Token في الـ Headers
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // جلب اليوزر والتأكد إنه لسه موجود في الداتابيز
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists." });
        }

        req.user = user;
        next();
    } catch (error) {
        // التعامل مع حالة انتهاء صلاحية التوكن بشكل أوضح
        const message = error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
        res.status(401).json({ success: false, message });
    }
};

// صلاحيات الأدمن والموظفين
export const authorize = (...roles) => {
    return (req, res, next) => {
        // التأكد من وجود يوزر ورول لتجنب الـ Crash
        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, message: "User role not identified." });
        }

        const userRole = req.user.role.toLowerCase();
        const allowedRoles = roles.map(role => role.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access Denied: Your role (${req.user.role}) is not authorized for this action.`
            });
        }
        next();
    };
};