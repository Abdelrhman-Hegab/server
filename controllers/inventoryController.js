import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        // الربط بالـ User اللي باعت الـ Request
        const product = new Product({
            name,
            category,
            price,
            quantity,
            addedBy: req.user._id // دي أهم حتة وبتاخدها من الـ Protect middleware
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        // لو حصل خطأ في الـ Validation هيرجع هنا
        res.status(400).json({ message: error.message });
    }
};
// @desc    Get all products
// @route   GET /api/inventory
export const getProducts = async (req, res) => {
    try {
        // Fetching all products from 'products' collection in 'sisms' database
        const products = await Product.find({});

        // This log will help you see if data is actually being pulled from Atlas
        console.log(`Inventory Sync: Found ${products.length} items`);

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
// @desc    Update Stock (Stock In/Out)
// @route   PUT /api/inventory/:id
export const updateStock = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        // البحث عن المنتج وتحديثه مع إرجاع النسخة الجديدة بعد التعديل
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price, quantity },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف المنتج (Delete)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};