const productController = require("../controllers/productController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const e = require("express");

const productRouter = express.Router();

productRouter.post("/", authMiddleware, adminMiddleware, productController.createProduct);

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);

productRouter.put("/:id", authMiddleware, adminMiddleware, productController.updateProduct);

productRouter.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = productRouter;