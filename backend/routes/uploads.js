const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const cloudinaryConfigured = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  return Boolean(cloud_name && api_key && api_secret);
};

router.post('/image', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file was provided.' });
    }

    if (!cloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env.',
      });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid image type. Use JPG, PNG, or WebP.' });
    }

    const buffer = req.file.buffer;
    const base64 = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio-site',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );

      stream.end(buffer);
    });

    return res.json({
      success: true,
      url: result?.secure_url || result?.url || base64,
      publicId: result?.public_id || '',
    });
 } catch (error) {
  console.error('========== CLOUDINARY UPLOAD ERROR ==========');
  console.error('Message:', error?.message);
  console.error('Name:', error?.name);
  console.error('HTTP Code:', error?.http_code);
  console.error('Error:', error);
  console.error('==============================================');

  return res.status(error?.http_code || 500).json({
    success: false,
    message: error?.message || 'Cloudinary upload failed',
    cloudinaryError: error?.error || null,
  });
}
});

router.post('/file', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No certificate file was provided.' });
    }
    if (!cloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env.',
      });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid certificate type. Use PDF, JPG, PNG, or WebP.' });
    }

    const isPdf = req.file.mimetype === 'application/pdf';
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio-certificates',
          resource_type: 'image',
          type: 'upload',
          eager: isPdf
            ? [{ page: 1, width: 360, height: 220, crop: 'fill', format: 'jpg' }]
            : undefined,
        },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
      );
      stream.end(req.file.buffer);
    });

    const previewUrl = cloudinary.url(result.public_id, {
      resource_type: 'image',
      type: result.type || 'upload',
      format: result.format || (isPdf ? 'pdf' : undefined),
      secure: true,
      sign_url: true,
    });
    const thumbnailUrl = isPdf
      ? result?.eager?.[0]?.secure_url || ''
      : result?.secure_url || result?.url || '';

    return res.json({
      success: true,
      url: result?.secure_url || result?.url || '',
      previewUrl,
      thumbnailUrl,
      publicId: result?.public_id || '',
      fileType: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
