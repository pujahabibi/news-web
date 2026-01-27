const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const path = require('path');
const { env } = require('../config/env');

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const THUMBNAIL_SIZE = 256;

class UploadThumbnail {
  async execute(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type and size
    if (!SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(`Unsupported file type. Only JPEG, PNG, and GIF are allowed.`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }

    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const uniqueThumbnailFilename = `${uuidv4()}-thumb${fileExtension}`;

    const originalFilePath = path.join(env.THUMBNAIL_STORAGE_PATH, uniqueFilename);
    const thumbnailFilePath = path.join(env.THUMBNAIL_STORAGE_PATH, uniqueThumbnailFilename);

    // Ensure the storage directory exists
    await fs.mkdir(env.THUMBNAIL_STORAGE_PATH, { recursive: true });

    // Save the original file
    await fs.writeFile(originalFilePath, file.buffer);

    // Create and save the thumbnail
    await sharp(file.buffer)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(thumbnailFilePath);

    // Return the public URLs
    const originalUrl = `${env.THUMBNAIL_BASE_URL}/${uniqueFilename}`;
    const thumbnailUrl = `${env.THUMBNAIL_BASE_URL}/${uniqueThumbnailFilename}`;

    return {
      originalUrl,
      thumbnailUrl
    };
  }
}

module.exports = UploadThumbnail;
