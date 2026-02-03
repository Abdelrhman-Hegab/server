import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true, // عشان نمنع تكرار نفس العميل
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // مين الموظف أو الأدمن اللي سجل العميل
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);