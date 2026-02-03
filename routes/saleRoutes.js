import express from "express";
import { createSale, getSalesHistory, getSalesStats } from "../controllers/saleController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "staff"), createSale);
router.get("/", protect, authorize("admin", "staff"), getSalesHistory);
router.get("/stats", protect, authorize("admin"), getSalesStats);

export default router;