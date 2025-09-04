const InternalServer = require("../utils/internal-server");
const prisma = require("../config/db");

exports.createContent = async (req, res) => {
    try {
        const { contentTypeId, language, title, detail, imageUrl, isPublished } = req.body;

        const parseContentTypeId = parseInt(contentTypeId, 10)
        const newContent = await prisma.content.create({
            data: {
                contentTypeId: parseContentTypeId,
                language,
                title,
                detail,
                imageUrl,
                isPublished: isPublished || false,
            },
            include: { contentType: true },
        });

        return res.status(201).json({
            success: true,
            data: newContent,
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.getContents = async (req, res) => {
    try {
        const contents = await prisma.content.findMany({
            include: { contentType: true },
            orderBy: { createdAt: "desc" },
        });

        return res.json({
            success: true,
            data: contents,
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await prisma.content.findUnique({
            where: { id: Number(id) },
            include: { contentType: true },
        });

        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }

        return res.json({
            success: true,
            data: content,
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { contentTypeId, language, title, detail, imageUrl, isPublished } = req.body;

        const updated = await prisma.content.update({
            where: { id: Number(id) },
            data: {
                contentTypeId,
                language,
                title,
                detail,
                imageUrl,
                isPublished,
            },
            include: { contentType: true },
        });

        return res.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        InternalServer(error, res);
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.content.delete({
            where: { id: Number(id) },
        });

        return res.json({
            success: true,
            message: "Content deleted successfully",
        });
    } catch (error) {
        InternalServer(error, res);
    }
};
