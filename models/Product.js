import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            default: 0,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // الربط بالأدمن أو الموظف اللي أضاف المنتج
            required: true,
        },
    },
    { timestamps: true }
);
// في ملف models/Product.js
const Product = mongoose.model("Product", productSchema, "products"); // ضفنا "products" هنا للتأكيد
export default Product;