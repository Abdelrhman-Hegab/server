import Customer from "../models/Customer.js";
import User from "../models/User.js";

// 1. جلب كل المستخدمين (هذه الدالة التي كانت ناقصة وتسببت في الخطأ)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password"); // نجلب المستخدمين بدون إرسال الباسورد
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. تحديث رتبة المستخدم (Role)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. إضافة عميل جديد
export const addCustomer = async (req, res) => {
    try {
        const customer = await Customer.create({
            ...req.body,
            addedBy: req.user.id,
        });
        res.status(201).json({ success: true, data: customer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. جلب كل العملاء
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate("addedBy", "name");
        res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 5. حذف عميل
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, message: "Customer removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};