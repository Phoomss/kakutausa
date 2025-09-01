const contentTypeController = require("../controllers/contentTypeController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const contentTypeRouter = express.Router();

contentTypeRouter.get('/', contentTypeController.getAllContentType)
contentTypeRouter.get('/:id', contentTypeController.getContentTypeById)

contentTypeRouter.post('/', [adminMiddleware, authMiddleware], contentTypeController.createContentType)

contentTypeRouter.put('/:id', [adminMiddleware, authMiddleware], contentTypeController.updateContentType)

contentTypeRouter.delete('/:id', [adminMiddleware, authMiddleware], contentTypeController.deleteContentType)

module.exports = contentTypeRouter;
