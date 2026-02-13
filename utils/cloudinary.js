const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicId = (url) => {
    if (!url) return null;
    try {
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        const fileName = lastPart.split('.')[0];
        // If nested folder, might need more logic, but default storage often puts it in a folder
        // configured in multer-storage-cloudinary. Let's assume standard format for now.
        // Actually, multer-storage-cloudinary usually returns the full public_id in req.file.filename
        // But for existing URLs, we need to extract.
        // Pattern: .../upload/v12345/folder/filename.jpg -> folder/filename
        const uploadIndex = parts.findIndex(part => part === 'upload');
        if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
            // everything after version number (v12345)
            const versionPart = parts[uploadIndex + 1];
            if (versionPart.startsWith('v')) {
                return parts.slice(uploadIndex + 2).join('/').split('.')[0];
            }
        }
        return fileName;
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return null;
    }
};

const deleteFile = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error(`Error deleting from Cloudinary: ${error.message}`);
    }
};

module.exports = { cloudinary, extractPublicId, deleteFile };
