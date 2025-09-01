const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server")

exports.createProduct = async (req, res) => {
    const { name, details, description, categoryId } = req.body;
    try {
        if (!name || !details || !description || !categoryId) {
            return res.status(400).json({ message: "name, description, and categoryId are required" });
        }

        const parseCategoryId = parseInt(categoryId, 10);
        if (isNaN(parseCategoryId)) {
            return res.status(400).json({ message: "categoryId must be a valid number" });
        }

        const category = await prisma.category.findUnique({
            where: { id: parseCategoryId }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                details,
                description,
                categoryId: parseCategoryId
            }
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json({
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, details, description, categoryId } = req.body;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let parseCategoryId;
        if (categoryId) {
            parseCategoryId = parseInt(categoryId, 10);
            if (isNaN(parseCategoryId)) {
                return res.status(400).json({ message: "categoryId must be a valid number" });
            }

            const category = await prisma.category.findUnique({
                where: { id: parseCategoryId }
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            product.categoryId = parseCategoryId;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: name || product.name,
                details: details || product.details,
                description: description || product.description,
                categoryId: product.categoryId
            }
        });

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        InternalServer(res, error)
    }
}