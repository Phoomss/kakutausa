const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");
const deleteFile = require("../utils/deleteFile");

// ✅ Create Product
exports.createProduct = async (req, res) => {
    const { name, details, description, categoryId } = req.body;
    try {
        if (!name || !details || !description || !categoryId) {
            return res
                .status(400)
                .json({ message: "name, description, and categoryId are required" });
        }

        const parseCategoryId = parseInt(categoryId, 10);
        if (isNaN(parseCategoryId)) {
            return res.status(400).json({ message: "categoryId must be a valid number" });
        }

        const category = await prisma.category.findUnique({
            where: { id: parseCategoryId },
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                details,
                description,
                categoryId: parseCategoryId,
            },
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

// ✅ Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                images: true,
                models: true,
            },
        });
        return res.status(200).json({
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

// ✅ Get product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true,
                models: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, details, description, categoryId } = req.body;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { images: true, models: true },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let parseCategoryId = product.categoryId;
        if (categoryId) {
            parseCategoryId = parseInt(categoryId, 10);
            if (isNaN(parseCategoryId)) {
                return res.status(400).json({ message: "categoryId must be a valid number" });
            }

            const category = await prisma.category.findUnique({
                where: { id: parseCategoryId },
            });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: name || product.name,
                details: details || product.details,
                description: description || product.description,
                categoryId: parseCategoryId,
            },
        });

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

// ✅ Delete Product + ลบไฟล์รูป/โมเดล
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true,
                models: true,
            },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ลบไฟล์รูป
        product.images.forEach((img) => deleteFile(img.imageUrl));
        // ลบไฟล์โมเดล
        product.models.forEach((model) => {
            deleteFile(model.gltfUrl);
            deleteFile(model.binUrl);
        });

        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.uploadImage = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const imageUrl = `/uploads/images/${req.file.filename}`;
        const newImage = await prisma.productImage.create({
            data: {
                productId: parseInt(id),
                imageUrl,
            },
        });

        res.status(201).json({
            message: "Image uploaded successfully",
            data: newImage,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.uploadModel = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const gltfFile = req.files["gltf"]?.[0];
        const binFile = req.files["bin"]?.[0];

        const gltfUrl = gltfFile ? `/uploads/models/${gltfFile.filename}` : null;
        const binUrl = binFile ? `/uploads/models/${binFile.filename}` : null;

        const newModel = await prisma.productModel.create({
            data: {
                productId: parseInt(id),
                gltfUrl,
                binUrl,
            },
        });

        res.status(201).json({
            message: "Model uploaded successfully",
            data: newModel,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};
