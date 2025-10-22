const InternalServer = require("../utils/internal-server");
const prisma = require("../config/db");
const { uploadFileToSupabase, deleteFileFromSupabase } = require("../utils/supabaseStorage");

exports.createContent = async (req, res) => {
    try {
        // Extract values from form data
        const contentTypeId = req.body.contentTypeId;
        const language = req.body.language;
        const title = req.body.title;
        const detail = req.body.detail;
        const isPublished = req.body.isPublished;

        if (!contentTypeId || !language || !title) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: contentTypeId, language, and title are required"
            });
        }

        const parseContentTypeId = parseInt(contentTypeId, 10);
        if (isNaN(parseContentTypeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contentTypeId"
            });
        }

        // Validate language field
        if (typeof language !== 'string' || language.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Language is required and must be a valid string"
            });
        }

        // Validate title field
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Title is required and must be a valid non-empty string"
            });
        }

        let imageUrl = null;

        if (req.file) {
            const uploaded = await uploadFileToSupabase(req.file, "content");
            imageUrl = uploaded.url;
        }

        const newContent = await prisma.content.create({
            data: {
                contentTypeId: parseContentTypeId,
                language: language.trim(),
                title: title.trim(),
                detail: detail ? detail.trim() : null, // Allow null for detail
                imageUrl: imageUrl,
                isPublished: isPublished === "true" || isPublished === true || false,
            },
            include: { contentType: true },
        });

        return res.status(201).json({
            success: true,
            data: newContent,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};


exports.getContents = async (req, res) => {
    try {
        const contents = await prisma.content.findMany({
            include: { contentType: true },
        });

        return res.json({
            success: true,
            data: contents,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedId = parseInt(id, 10);

        // ตรวจสอบว่า id เป็นตัวเลขจริงหรือไม่
        if (isNaN(parsedId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid content ID",
            });
        }

        const content = await prisma.content.findUnique({
            where: { id: parsedId },
            include: { contentType: true },
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }

        return res.json({
            success: true,
            data: content,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.getContentsByType = async (req, res) => {
    try {
        const { contentType } = req.query;

        const whereClause = {};
        if (contentType) {
            whereClause.contentType = {
                name: { equals: contentType }
            };
        }

        const query = await prisma.content.findMany({
            where: whereClause,
            include: {
                contentType: true,
            },
        });

        if (query.length === 0) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }

        return res.json({
            success: true,
            data: query,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Extract values from form data
    const contentTypeId = req.body.contentTypeId;
    const language = req.body.language;
    const title = req.body.title;
    const detail = req.body.detail;
    const isPublished = req.body.isPublished;

    if (!contentTypeId || !language || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: contentTypeId, language, and title are required"
      });
    }

    const oldContent = await prisma.content.findUnique({ where: { id: Number(id) } });
    if (!oldContent) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    const parseContentTypeId = parseInt(contentTypeId, 10);
    if (isNaN(parseContentTypeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contentTypeId"
      });
    }

    // Validate language field
    if (typeof language !== 'string' || language.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Language is required and must be a valid string"
      });
    }

    // Validate title field
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be a valid non-empty string"
      });
    }

    let imageUrl = oldContent.imageUrl;

    if (req.file) {
      const uploaded = await uploadFileToSupabase(req.file, "content");
      imageUrl = uploaded.url;

      if (oldContent.imageUrl && oldContent.imageUrl.includes("/storage/v1/object/public/")) {
        const pathStart = oldContent.imageUrl.split("/storage/v1/object/public/")[1];
        await deleteFileFromSupabase(pathStart, "content");
      }
    }

    const updated = await prisma.content.update({
      where: { id: Number(id) },
      data: {
        contentTypeId: parseContentTypeId,
        language: language.trim(),
        title: title.trim(),
        detail: detail ? detail.trim() : null, // Allow null for detail
        imageUrl: imageUrl,
        isPublished: isPublished === "true" || isPublished === true || false,
      },
      include: { contentType: true },
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    InternalServer(res, error);
  }
};

exports.deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await prisma.content.findUnique({
            where: { id: Number(id) },
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }

        // 🔥 ถ้ามี imageUrl — ลบไฟล์ออกจาก Supabase ก่อน
        if (content.imageUrl && content.imageUrl.includes("/storage/v1/object/public/")) {
            const pathStart = content.imageUrl.split("/storage/v1/object/public/")[1];
            await deleteFileFromSupabase(pathStart, "content");
        }

        // 🔥 ลบข้อมูลออกจากฐานข้อมูล
        await prisma.content.delete({
            where: { id: Number(id) },
        });

        return res.json({
            success: true,
            message: "Content deleted successfully",
        });
    } catch (error) {
        InternalServer(res, error);
    }
};
