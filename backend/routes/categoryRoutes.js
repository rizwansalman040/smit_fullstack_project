const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Anyone can view categories
router.get('/', getCategories);

// Only admin can add or delete (image goes to Cloudinary)
router.post('/', protectAdmin, upload.single('image'), createCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;
