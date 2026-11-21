const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        let imageUrl = req.body.imageUrl;

        // If Cloudinary processed an uploaded image, use that secure URL
        if (req.file) {
            imageUrl = req.file.path;
        }

        if (!name || !imageUrl) {
            return res.status(400).json({ message: 'Please provide both a category name and an image.' });
        }

        // Check if category already exists to prevent duplicates
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name, imageUrl });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error: error.message });
    }
};

module.exports = { getCategories, createCategory, deleteCategory };