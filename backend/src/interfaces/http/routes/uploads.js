const express = require('express');
const multer = require('multer');
const UploadThumbnail = require('../../../usecases/UploadThumbnail');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/thumbnail', upload.single('thumbnail'), async (req, res, next) => {
  try {
    const uploadThumbnail = new UploadThumbnail();
    const result = await uploadThumbnail.execute(req.file);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
