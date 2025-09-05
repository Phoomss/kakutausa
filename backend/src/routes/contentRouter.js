const express = require("express");
const contentController = require("../controllers/contentController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const contentRouter = express.Router();

contentRouter.get("/", contentController.getContents);
contentRouter.get("/search", contentController.getContentsByType)
contentRouter.get("/:id", contentController.getContentById);

contentRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  contentController.createContent
);

contentRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  contentController.updateContent
);

contentRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  contentController.deleteContent
);

module.exports = contentRouter; 