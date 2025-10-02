const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");
const path = require("path");
const { deleteFileFromSupabase, uploadModelFiles, uploadFileToSupabase } = require("../utils/supabaseStorage");

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

exports.createProduct = async (req, res) => {
  const { name, details, description, categoryId, sizes } = req.body;

  try {
    if (!name || !description || !categoryId)
      return res.status(400).json({ message: "name, description, and categoryId are required" });

    const parseCategoryId = parseInt(categoryId, 10);
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

    console.log(newProduct)
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
          const aIsJpg = a.imageUrl.toLowerCase().endsWith('.jpg');
          const bIsJpg = b.imageUrl.toLowerCase().endsWith('.jpg');

          if (aIsJpg && !bIsJpg) return -1;
          if (!aIsJpg && bIsJpg) return 1;
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
          const aIsJpg = a.imageUrl.toLowerCase().endsWith('.jpg');
          const bIsJpg = b.imageUrl.toLowerCase().endsWith('.jpg');

          if (aIsJpg && !bIsJpg) return -1;
          if (!aIsJpg && bIsJpg) return 1;
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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { sizes: true, images: true, models: true, category: true },
    });

    const sortedProducts = products.map(p => ({
      ...p,
      images: p.images.sort((a, b) => {
        // Prioritize .jpg files first
        const aIsJpg = a.imageUrl.toLowerCase().endsWith('.jpg');
        const bIsJpg = b.imageUrl.toLowerCase().endsWith('.jpg');

        if (aIsJpg && !bIsJpg) return -1;
        if (!aIsJpg && bIsJpg) return 1;
        return 0;
      })
    }));

    res.status(200).json({ message: "Products fetched successfully", data: sortedProducts });
  } catch (error) {
    InternalServer(res, error);
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { sizes: true, images: true, models: true, category: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images.sort((a, b) => {
      // Prioritize .jpg files first
      const aIsJpg = a.imageUrl.toLowerCase().endsWith('.jpg');
      const bIsJpg = b.imageUrl.toLowerCase().endsWith('.jpg');

      if (aIsJpg && !bIsJpg) return -1;
      if (!aIsJpg && bIsJpg) return 1;
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

    images.sort((a, b) => {
      const aIsJpg = a.imageUrl.toLowerCase().endsWith('.jpg');
      const bIsJpg = b.imageUrl.toLowerCase().endsWith('.jpg');

      if (aIsJpg && !bIsJpg) return -1;
      if (!aIsJpg && bIsJpg) return 1;
      return 0;
    });

    res.status(200).json({ message: "Images fetched successfully", data: images });
  } catch (error) {
    InternalServer(res, error);
  }
};

exports.getProductModels = async (req, res) => {
  const { id } = req.params;
  try {
    const models = await prisma.productModel.findMany({
      where: { productId: parseInt(id) },
      select: { gltfUrl: true, binUrl: true, stepUrl: true }
    });

    if (!models || models.length === 0)
      return res.status(404).json({ message: "No 3D models found" });

    res.status(200).json({ message: "Models fetched", data: models });
  } catch (error) {
    InternalServer(res, error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, details, description, categoryId, sizes, updateType } = req.body;
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

    if (updateType === "images" && files?.length > 0) {
      await Promise.all(product.images.map(img => deleteFileFromSupabase(img.filePath)));
      await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });

      const uploadedImages = await Promise.all(
        files.filter(f => f.mimetype.startsWith("image/"))
          .map(f => uploadFileToSupabase(f, "images"))
      );
      const imagesData = uploadedImages.map(f => ({ productId: parseInt(id), imageUrl: f.url, filePath: f.path }));
      if (imagesData.length > 0) await prisma.productImage.createMany({ data: imagesData });
    }

    if (updateType === "models" && files?.length > 0) {
      await Promise.all(
        product.models.flatMap(model => [model.gltfPath, model.binPath, model.stepPath].filter(Boolean))
          .map(p => deleteFileFromSupabase(p))
      );
      await prisma.productModel.deleteMany({ where: { productId: parseInt(id) } });

      const modelFiles = {
        gltf: files.find(f => f.originalname.endsWith(".gltf")),
        bin: files.find(f => f.originalname.endsWith(".bin")),
        step: files.find(f => f.originalname.endsWith(".step")),
      };

      const uploadedModels = {};
      for (const [key, file] of Object.entries(modelFiles)) {
        if (file) uploadedModels[key] = await uploadFileToSupabase(file, "models");
      }

      if (Object.keys(uploadedModels).length > 0) {
        await prisma.productModel.create({
          data: {
            productId: parseInt(id),
            gltfUrl: uploadedModels.gltf?.url || null,
            binUrl: uploadedModels.bin?.url || null,
            stepUrl: uploadedModels.step?.url || null,
            gltfPath: uploadedModels.gltf?.path || null,
            binPath: uploadedModels.bin?.path || null,
            stepPath: uploadedModels.step?.path || null,
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
  const { deleteType } = req.query;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { images: true, models: true, sizes: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (deleteType === "images") {
      await Promise.all(product.images.map(img => deleteFileFromSupabase(img.filePath)));
      await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
      return res.status(200).json({ message: "Images deleted successfully" });
    }

    if (deleteType === "models") {
      await Promise.all(
        product.models
          .flatMap(m => [m.gltfPath, m.binPath, m.stepPath].filter(Boolean))
          .map(p => deleteFileFromSupabase(p))
      );
      await prisma.productModel.deleteMany({ where: { productId: parseInt(id) } });
      return res.status(200).json({ message: "Models deleted successfully" });
    }

    await Promise.all(product.images.map(img => deleteFileFromSupabase(img.filePath)));
    await Promise.all(
      product.models
        .flatMap(m => [m.gltfPath, m.binPath, m.stepPath].filter(Boolean))
        .map(p => deleteFileFromSupabase(p))
    );

    await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.productModel.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.size.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Product and all files deleted successfully" });

  } catch (error) {
    InternalServer(res, error);
  }
};

// Upload images
exports.uploadImages = async (req, res) => {
  const { id } = req.params;
  if (!req.files?.length) return res.status(400).json({ message: "No files uploaded" });

  try {
    const uploaded = await Promise.all(
      req.files
        .filter(f => f.mimetype.startsWith("image/"))
        .map(f => uploadFileToSupabase(f, "images"))
    );

    const imagesData = uploaded.map(f => ({
      productId: parseInt(id),
      imageUrl: f.path,
    }));

    await prisma.productImage.createMany({ data: imagesData });

    res.status(201).json({ message: "Images uploaded successfully", data: imagesData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload images", error: err.message });
  }
};

exports.uploadModel = async (req, res) => {
  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No model files uploaded" });
  }

  try {
    // ใช้ uploadModelFiles เพื่อ upload และแก้ไข reference ใน .gltf อัตโนมัติ
    const uploadedFiles = await uploadModelFiles(files, parseInt(id));

    // ตรวจสอบว่ามีไฟล์ที่จำเป็น
    if (!uploadedFiles.gltf || !uploadedFiles.bin) {
      return res.status(400).json({ message: "GLTF and BIN files are required" });
    }

    const newModel = await prisma.productModel.create({
      data: {
        productId: parseInt(id),
        gltfUrl: uploadedFiles.gltf.path,
        binUrl: uploadedFiles.bin.path,
        stepUrl: uploadedFiles.step?.path || null,
      },
    });

    res.status(201).json({
      message: "Model uploaded successfully",
      data: newModel,
      files: {
        gltf: uploadedFiles.gltf.fileName,
        bin: uploadedFiles.bin.fileName,
        step: uploadedFiles.step?.fileName,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload model", error: err.message });
  }
};