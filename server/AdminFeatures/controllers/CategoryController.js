const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        let category = new Category(req.body);
        let savedCategory = await category.save();
        res.status(200).json(savedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        if (categories.length > 0) {
            res.status(200).json(categories);
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a Category
exports.deleteCategory = async (req, res)=>{
    try {
        let response = await Category.findByIdAndDelete(req.params.id);
        if (response) {
            res.status(200).json({message: 'Successfully Deleted'});
        } else {
            res.status(404).json({message: 'Category Not Found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error Please Check You Credentials '})
    }
};