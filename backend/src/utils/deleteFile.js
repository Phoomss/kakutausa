const fs = require("fs").promises;
const path = require("path");

const deleteFile = async (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, "..", filePath); // filePath เริ่มด้วย /uploads
  try {
    await fs.unlink(fullPath);
    console.log(`Deleted file: ${fullPath}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`File not found: ${fullPath}`);
    } else {
      console.error(`Error deleting file: ${fullPath}`, err);
    }
  }
};

module.exports = deleteFile;
