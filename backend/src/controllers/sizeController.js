const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server")

exports.createSize = async (req, res) => {
    const { productId, holdingCapacity, weight, handleMoves, barMoves } = req.body

    try {
        const parseProductId = parseInt(productId, 10);
        if (isNaN(parseProductId)) {
            return res.status(400).json({ message: "productId must be a valid number" });
        }

        if (!productId || !holdingCapacity || !weight || !handleMoves || !barMoves) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseProductId }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const newSize = await prisma.size.create({
            data: {
                productId: parseProductId,
                holdingCapacity,
                weight,
                handleMoves,
                barMoves
            }
        });

        return res.status(201).json({
            message: "Size created successfully",
            data: newSize
        });
    } catch (error) {
        InternalServer(error, res)
    }
}

exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await prisma.size.findMany();
        return res.status(200).json({
            message: "Sizes fetched successfully",
            data: sizes
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getSizeById = async (req, res) => {
    const { id } = req.params;
    try {
        const size = await prisma.size.findUnique({
            where: { id: parseInt(id) }
        });
        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }

        return res.status(200).json({
            message: "Size fetched successfully",
            data: size
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.updateSize = async (req, res) => {
    const { id } = req.params;
    const { productId, holdingCapacity, weight, handleMoves, barMoves } = req.body;
    try {
        const size = await prisma.size.findUnique({
            where: { id: parseInt(id) }
        });

        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }

        const parseProductId = parseInt(productId, 10);
        if (isNaN(parseProductId)) {
            return res.status(400).json({ message: "productId must be a valid number" });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseProductId }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedSize = await prisma.size.update({
            where: { id: parseInt(id) },
            data: {
                productId: parseProductId || size.productId,
                holdingCapacity: holdingCapacity || size.holdingCapacity,
                weight: weight || size.weight,
                handleMoves: handleMoves || size.handleMoves,
                barMoves: barMoves || size.barMoves
            }
        });

        return res.status(200).json({
            message: "Size updated successfully",
            data: updatedSize
        });

    } catch (error) {
        InternalServer(res, error)
    }
}

exports.deleteSize = async (req, res) => {
    const { id } = req.params;
    try {
        const size = await prisma.size.findUnique({
            where: { id: parseInt(id) }
        });
        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }

        await prisma.size.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Size deleted successfully"
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

