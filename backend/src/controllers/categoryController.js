const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

exports.createCategory = async (req, res) => {
    const { name } = req.body
    try {
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const newCategory = await prisma.category.create({
            data: {
                name
            }
        })

        return res.status(201).json({
            message: "Category created successfully",
            data: newCategory
        })
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories
        })
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            data: category
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {

        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name }
        });

        return res.status(200).json({
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        InternalServer(res, error)
    }
}