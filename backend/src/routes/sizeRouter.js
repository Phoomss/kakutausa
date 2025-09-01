const sizeController = require("../controllers/sizeController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const e = require("express");

const sizeRouter = express.Router();

sizeRouter.get('/', sizeController.getAllSizes)
sizeRouter.get('/:id', sizeController.getAllSizes)

sizeRouter.post('/', [adminMiddleware, authMiddleware], sizeController.createSize)

sizeRouter.put('/:id', [adminMiddleware, authMiddleware], sizeController.updateSize)

sizeRouter.delete('/:id', [adminMiddleware, authMiddleware], sizeController.deleteSize)

module.exports = sizeRouter