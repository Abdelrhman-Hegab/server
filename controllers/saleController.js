import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// @desc    Create a new sale and update stock (With Transaction)
// @route   POST /api/sales
// @access  Private (Admin/Staff)
export const createSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { customerId, items } = req.body;
        let totalAmount = 0;

        for (let item of items) {
            const product = await Product.findById(item.product).session(session);

            if (!product || product.quantity < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    success: false,
                    message: `Product ${product ? product.name : 'not found'} is out of stock.`
                });
            }

            totalAmount += item.price * item.quantity;

            // تحديث المخزن (Stock Out)
            product.quantity -= item.quantity;
            await product.save({ session });
        }

        const sale = await Sale.create([{
            customer: customerId,
            items,
            totalAmount,
            soldBy: req.user.id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Sale completed and stock updated successfully.",
            data: sale[0]
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all sales history
// @route   GET /api/sales
// @access  Private (Admin/Staff)
export const getSalesHistory = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("customer", "name phone")
            .populate("items.product", "name category")
            .populate("soldBy", "name")
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: sales.length,
            data: sales
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Sales Analytics (Total Revenue & Sales Count)
// @route   GET /api/sales/stats
// @access  Private (Admin Only)
export const getSalesStats = async (req, res) => {
    try {
        const stats = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalSales: { $sum: 1 },
                    avgSaleValue: { $avg: "$totalAmount" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0] || { totalRevenue: 0, totalSales: 0, avgSaleValue: 0 }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};