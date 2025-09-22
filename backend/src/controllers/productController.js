const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");
const deleteFile = require("../utils/deleteFile");
const path = require("path");

const mapSizesForDB = (sizes) => sizes.map((s) => ({
    holdingCapacityMetric: s.holdingCapacityMetric || null,
    weightMetric: s.weightMetric || null,
    handleMovesMetric: s.handleMovesMetric || null,
    barMovesMetric: s.barMovesMetric || null,
    drawingMovementMetric: s.drawingMovementMetric || null,

    holdingCapacityInch: s.holdingCapacityInch || null,
    weightInch: s.weightInch || null,
    handleMovesInch: s.handleMovesInch || null,
    barMovesInch: s.barMovesInch || null,
    drawingMovementInch: s.drawingMovementInch || null,
}));

// Create Product
exports.createProduct = async (req, res) => {
    const { name, details, description, categoryId, sizes } = req.body;
    try {
        if (!name || !description || !categoryId)
            return res.status(400).json({ message: "name, description, and categoryId are required" });

        const parseCategoryId = parseInt(categoryId, 10);
        if (isNaN(parseCategoryId)) return res.status(400).json({ message: "Invalid categoryId" });

        const category = await prisma.category.findUnique({ where: { id: parseCategoryId } });
        if (!category) return res.status(404).json({ message: "Category not found" });

        const newProduct = await prisma.product.create({
            data: {
                name,
                details,
                description,
                categoryId: parseCategoryId,
                sizes: sizes ? { create: mapSizesForDB(sizes) } : undefined,
            },
            include: { sizes: true, images: true, models: true },
        });

        res.status(201).json({ message: "Product created successfully", data: newProduct });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.getProductByCategory = async (req, res) => {
    try {
        const { category } = req.query;

        let products;

        if (category && category !== "All") {
            products = await prisma.product.findMany({
                where: {
                    category: {
                        name: category
                    }
                },
                include: {
                    category: true,
                    images: true
                }
            });

            products = products.map(p => ({
                ...p,
                images: p.images.sort((a, b) => {
                    if (a.imageUrl.endsWith(".jpg") && !b.imageUrl.endsWith(".jpg")) return -1;
                    if (!a.imageUrl.endsWith(".jpg") && b.imageUrl.endsWith(".jpg")) return 1;
                    return 0;
                })
            }));
        } else {
            products = await prisma.product.findMany({
                include: {
                    category: true,
                    images: true
                }
            });

            products = products.map(p => ({
                ...p,
                images: p.images.sort((a, b) => {
                    if (a.imageUrl.endsWith(".jpg") && !b.imageUrl.endsWith(".jpg")) return -1;
                    if (!a.imageUrl.endsWith(".jpg") && b.imageUrl.endsWith(".jpg")) return 1;
                    return 0;
                })
            }));
        }

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        InternalServer(res, error)
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { sizes: true, images: true, models: true, category: true },
        });

        const sortedProducts = products.map(p => ({
            ...p,
            images: p.images.sort((a, b) => {
                if (a.imageUrl.endsWith(".jpg") && !b.imageUrl.endsWith(".jpg")) return -1;
                if (!a.imageUrl.endsWith(".jpg") && b.imageUrl.endsWith(".jpg")) return 1;
                return 0;
            })
        }));

        res.status(200).json({ message: "Products fetched successfully", data: sortedProducts });
    } catch (error) {
        InternalServer(res, error);
    }
};


// Get product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { sizes: true, images: true, models: true, category: true },
        });

        if (!product) return res.status(404).json({ message: "Product not found" });

        product.images.sort((a, b) => {
            if (a.imageUrl.endsWith(".jpg") && !b.imageUrl.endsWith(".jpg")) return -1;
            if (!a.imageUrl.endsWith(".jpg") && b.imageUrl.endsWith(".jpg")) return 1;
            return 0;
        });

        res.status(200).json({ message: "Product fetched successfully", data: product });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.getProductImages = async (req, res) => {
    const { id } = req.params;
    try {
        const images = await prisma.productImage.findMany({
            where: { productId: parseInt(id) },
            select: { imageUrl: true },
        });

        if (!images || images.length === 0)
            return res.status(404).json({ message: "No images found for this product" });

        // sort: jpg ขึ้นก่อน webp
        images.sort((a, b) => {
            if (a.imageUrl.endsWith(".jpg") && !b.imageUrl.endsWith(".jpg")) return -1;
            if (!a.imageUrl.endsWith(".jpg") && b.imageUrl.endsWith(".jpg")) return 1;
            return 0;
        });

        res.status(200).json({ message: "Images fetched successfully", data: images });
    } catch (error) {
        InternalServer(res, error);
    }
};

// Get all 3D models of a product
exports.getProductModels = async (req, res) => {
    const { id } = req.params; // productId
    try {
        const models = await prisma.productModel.findMany({
            where: { productId: parseInt(id) },
            select: { gltfUrl: true, binUrl: true, stepUrl: true } 
        });

        if (!models || models.length === 0)
            return res.status(404).json({ message: "No 3D models found for this product" });

        res.status(200).json({ message: "Models fetched successfully", data: models });
    } catch (error) {
        InternalServer(res, error);
    }
};

// Update product (including optional nested sizes)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, details, description, categoryId, sizes } = req.body;
    const files = req.files;

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { sizes: true, images: true, models: true },
        });

        if (!product) return res.status(404).json({ message: "Product not found" });

        let parseCategoryId = product.categoryId;
        if (categoryId) {
            parseCategoryId = parseInt(categoryId, 10);
            const category = await prisma.category.findUnique({ where: { id: parseCategoryId } });
            if (!category) return res.status(404).json({ message: "Category not found" });
        }

        if (files) {

            if (product.images.length > 0) {
                await Promise.all(product.images.map(img => deleteFile(img.imageUrl)));
                await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
            }

            if (product.models.length > 0) {
                await Promise.all(
                    product.models.flatMap(model => [
                        model.gltfUrl ? deleteFile(model.gltfUrl) : null,
                        model.binUrl ? deleteFile(model.binUrl) : null,
                        model.stepUrl ? deleteFile(model.stepUrl) : null,
                    ]).filter(Boolean)
                );
                await prisma.productModel.deleteMany({ where: { productId: parseInt(id) } });
            }

            const imagesData = files
                .filter(f => f.mimetype.startsWith("image/"))
                .map(f => ({ productId: parseInt(id), imageUrl: `/uploads/images/${f.filename}` }));

            if (imagesData.length > 0) {
                await prisma.productImage.createMany({ data: imagesData });
            }

            const gltfFile = files.find(f => f.originalname.endsWith(".gltf"));
            const binFile = files.find(f => f.originalname.endsWith(".bin"));
            const stepFile = files.find(f => f.originalname.endsWith(".step"));

            if (gltfFile || binFile || stepFile) {
                await prisma.productModel.create({
                    data: {
                        productId: parseInt(id),
                        gltfUrl: gltfFile ? `/uploads/models/${gltfFile.filename}` : null,
                        binUrl: binFile ? `/uploads/models/${binFile.filename}` : null,
                        stepUrl: stepFile ? `/uploads/models/${stepFile.filename}` : null,
                    },
                });
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: name || product.name,
                details: details || product.details,
                description: description || product.description,
                categoryId: parseCategoryId,
                sizes: sizes ? { deleteMany: {}, create: mapSizesForDB(sizes) } : undefined,
            },
            include: { sizes: true, images: true, models: true },
        });

        res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { sizes: true, images: true, models: true },
        });

        if (!product) return res.status(404).json({ message: "Product not found" });

        await Promise.all([
            ...product.images.map(img => deleteFile(img.imageUrl)),
            ...product.models.flatMap(model => [
                model.gltfUrl ? deleteFile(model.gltfUrl) : null,
                model.binUrl ? deleteFile(model.binUrl) : null,
                model.stepUrl ? deleteFile(model.stepUrl) : null, 
            ]).filter(Boolean)
        ]);

        await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
        await prisma.productModel.deleteMany({ where: { productId: parseInt(id) } });
        await prisma.size.deleteMany({ where: { productId: parseInt(id) } });

        await prisma.product.delete({ where: { id: parseInt(id) } });

        res.status(200).json({ message: "Product and all related files deleted successfully" });
    } catch (error) {
        InternalServer(res, error);
    }
};

// Upload images
exports.uploadImage = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No file uploaded" });

        const imagesData = req.files.map((file) => ({
            productId: parseInt(id),
            imageUrl: `/uploads/images/${file.filename}`,
        }));
        const newImages = await prisma.productImage.createMany({ data: imagesData });

        res.status(201).json({ message: "Images uploaded successfully", data: newImages });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.uploadModel = async (req, res) => {
    const { id } = req.params;
    try {
        const gltfFile = req.files["gltf"]?.[0];
        const binFile = req.files["bin"]?.[0];
        const stepFile = req.files["step"]?.[0];

        if (!gltfFile || !binFile || !stepFile)
            return res.status(400).json({ message: "Both GLTF and BIN and STEP files are required" });

        const newModel = await prisma.productModel.create({
            data: {
                productId: parseInt(id),
                gltfUrl: gltfFile ? `/uploads/models/${gltfFile.originalname}` : null,
                binUrl: binFile ? `/uploads/models/${binFile.originalname}` : null,
                stepUrl: stepFile ? `/uploads/models/${stepFile.originalname}` : null,
            },
        });

        res.status(201).json({ message: "Model uploaded successfully", data: newModel });
    } catch (error) {
        InternalServer(res, error);
    }
};