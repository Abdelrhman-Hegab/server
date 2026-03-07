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

// --- تعديل 1: تحسين إعدادات CORS للسماح بجميع العمليات ---
app.use(cors({
    origin: "*", // يمكنك استبداله برابط Netlify لاحقاً لزيادة الأمان
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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

// --- تعديل 2: معالجة الأخطاء العامة (Global Error Handler) ---
// هذا يمنع السيرفر من الانهيار عند حدوث خطأ غير متوقع
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// إعدادات اتصال MongoDB
const connectDB = async () => {
    try {
        // التحقق من وجود URI قبل المحاولة
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in environment variables!");
        }

        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        // في بيئة الـ Production، يفضل الخروج إذا لم يتصل بقاعدة البيانات
        // process.exit(1); 
    }
};

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});

export default app;