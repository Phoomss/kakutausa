const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server")

exports.createSize = async (req, res) => {
    const { productId, holdingCapacity, weight, handleMoves, barMoves } = req.body

    try {
        const parseProductId = parseInt(productId, 10);
        if (isNaN(parseProductId)) {
            return res.status(400).json({ message: "productId must be a valid number" });
        }

        // Validate required fields exist
        if (!productId || holdingCapacity === undefined || weight === undefined || handleMoves === undefined || barMoves === undefined) {
            return res.status(400).json({ message: "productId, holdingCapacity, weight, handleMoves, and barMoves are required" });
        }
        
        // Validate numeric values
        if (typeof holdingCapacity !== 'number' || typeof weight !== 'number' || 
            typeof handleMoves !== 'number' || typeof barMoves !== 'number') {
            return res.status(400).json({ message: "holdingCapacity, weight, handleMoves, and barMoves must be numbers" });
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

        // Validate productId if provided
        let parseProductId;
        if (productId !== undefined) {
            parseProductId = parseInt(productId, 10);
            if (isNaN(parseProductId)) {
                return res.status(400).json({ message: "productId must be a valid number" });
            }

            const product = await prisma.product.findUnique({
                where: { id: parseProductId }
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
        }

        // Validate numeric fields if provided
        if (holdingCapacity !== undefined && typeof holdingCapacity !== 'number') {
            return res.status(400).json({ message: "holdingCapacity must be a number" });
        }
        if (weight !== undefined && typeof weight !== 'number') {
            return res.status(400).json({ message: "weight must be a number" });
        }
        if (handleMoves !== undefined && typeof handleMoves !== 'number') {
            return res.status(400).json({ message: "handleMoves must be a number" });
        }
        if (barMoves !== undefined && typeof barMoves !== 'number') {
            return res.status(400).json({ message: "barMoves must be a number" });
        }

        const updatedSize = await prisma.size.update({
            where: { id: parseInt(id) },
            data: {
                productId: productId !== undefined ? parseProductId : undefined,
                holdingCapacity: holdingCapacity !== undefined ? holdingCapacity : undefined,
                weight: weight !== undefined ? weight : undefined,
                handleMoves: handleMoves !== undefined ? handleMoves : undefined,
                barMoves: barMoves !== undefined ? barMoves : undefined
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

