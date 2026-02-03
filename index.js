import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

// تأكد من استدعاء dotenv في أول السطر
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);

// صفحة اختبار أساسية
app.get("/", (req, res) => {
    res.send("SISMS API is Running...");
});

// إعدادات اتصال MongoDB مع معالجة الأخطاء
const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            // هذه الإعدادات تضمن أن السيرفر سيعطيك خطأ لو لم يتصل خلال 5 ثوانٍ
            serverSelectionTimeoutMS: 5000,
        });

        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:");
        console.error(err.message);
        // في حالة فشل الاتصال، لا نغلق السيرفر بل نتركه يحاول مرة أخرى عند الطلب
    }
};

// تشغيل السيرفر والاتصال بالقاعدة
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB(); // استدعاء دالة الاتصال هنا
});