import express from "express";
import {
    addCustomer,
    getCustomers,
    deleteCustomer,
    updateUserRole,
    getAllUsers
} from "../controllers/customerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// مسارات العملاء
router.post("/", protect, authorize("admin", "staff"), addCustomer);
router.get("/", protect, authorize("admin", "staff"), getCustomers);
router.delete('/:id', protect, authorize("admin"), deleteCustomer);

// مسار تعديل الرول (Admin Only)
router.put('/:id/role', protect, authorize("admin"), updateUserRole);
// في ملف الراوتس
router.get("/users", protect, authorize("admin"), getAllUsers);
export default router;