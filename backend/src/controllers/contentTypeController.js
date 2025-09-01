const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

exports.createContentType = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({
                message: "name field is required"
            });
        }

        const newContentType = await prisma.contentType.create({
            data: { name }
        });

        return res.status(201).json({
            message: "Content Type created successfully",
            data: newContentType
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.getAllContentType = async (req, res) => {
    try {
        const contentTypes = await prisma.contentType.findMany();
        return res.status(200).json({
            message: "Content Types fetched successfully",
            data: contentTypes
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.getContentTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const contentType = await prisma.contentType.findUnique({
            where: { id: Number(id) }
        });

        if (!contentType) {
            return res.status(404).json({
                message: "Content Type not found"
            });
        }

        return res.status(200).json({
            message: "Content Type fetched successfully",
            data: contentType
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.updateContentType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({
                message: "name field is required"
            });
        }

        const contentType = await prisma.contentType.findUnique({
            where: { id: Number(id) }
        });

        if (!contentType) {
            return res.status(404).json({
                message: "Content Type not found"
            });
        }

        const updatedContentType = await prisma.contentType.update({
            where: { id: Number(id) },
            data: { name }
        });

        return res.status(200).json({
            message: "Content Type updated successfully",
            data: updatedContentType
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.deleteContentType = async (req, res) => {
    const { id } = req.params;

    try {
        const contentType = await prisma.contentType.findUnique({
            where: { id: Number(id) }
        });

        if (!contentType) {
            return res.status(404).json({
                message: "Content Type not found"
            });
        }

        await prisma.contentType.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            message: "Content Type deleted successfully"
        });
    } catch (error) {
        InternalServer(error, res);
    }
};
