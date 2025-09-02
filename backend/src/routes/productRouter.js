const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../utils/uploadStorage");

const productRouter = express.Router();

productRouter.post(
    "/",
    [authMiddleware,
        adminMiddleware
    ],
    productController.createProduct
);

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);

productRouter.put(
    "/:id",
    [authMiddleware,
        adminMiddleware
    ],
    productController.updateProduct
);

productRouter.delete(
    "/:id",
    [authMiddleware,
        adminMiddleware
    ],
    productController.deleteProduct
);

productRouter.post(
    "/:id/images",
    [authMiddleware,
        adminMiddleware
    ],
    upload.single("image"),
    productController.uploadImage
);

productRouter.post(
    "/:id/models",
    [authMiddleware,
        adminMiddleware
    ],
    upload.fields([{ name: "gltf" }, { name: "bin" }]),
    productController.uploadModel
);

module.exports = productRouter;
