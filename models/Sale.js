import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer", // ربط الفاتورة بعميل محدد
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", // ربط الصنف بالمنتجات في المخزن
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number, // السعر وقت البيع
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        soldBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // الموظف اللي عمل العملية
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);