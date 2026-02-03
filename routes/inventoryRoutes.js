import express from "express";
import {
    addProduct,
    getProducts,
    updateStock,
    deleteProduct
} from "../controllers/inventoryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ملاحظة: تم تعديل الـ Roles لتشمل الحروف الكبيرة والصغيرة لضمان عدم حدوث خطأ
// 1. عرض المنتجات (متاح للأدمن والموظف)
router.get("/", protect, authorize("admin", "staff", "Admin", "Staff"), getProducts);

// 2. إضافة منتج جديد
router.post("/", protect, authorize("admin", "staff", "Admin", "Staff"), addProduct);

// 3. تحديث البيانات أو المخزون
router.put("/:id", protect, authorize("admin", "staff", "Admin", "Staff"), updateStock);

// 4. الحذف (للأدمن فقط)
router.delete("/:id", protect, authorize("admin", "Admin"), deleteProduct);

export default router;