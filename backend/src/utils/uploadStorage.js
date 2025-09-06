// utils/uploadStorage.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/images";
    } else if (
      file.mimetype === "model/gltf+json" ||
      file.mimetype === "application/octet-stream" ||
      file.originalname.endsWith(".gltf") ||
      file.originalname.endsWith(".bin")
    ) {
      folder = "uploads/models";
    }

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // เก็บชื่อไฟล์เดิม ตามที่ผู้ใช้ upload
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
module.exports = upload;
