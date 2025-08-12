import { Request, Response } from 'express';
import cloudinary from '../../config/cloudinary';
import streamifier from 'streamifier';

export const uploadController = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const { buffer, mimetype, originalname, size } = req.file;

  const isImage = mimetype.startsWith('image/');
  const resourceType = isImage ? 'image' : 'raw';

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: 'whatsapp-clone',
        transformation: isImage
          ? [
              { quality: 'auto' },
              { fetch_format: 'auto' },
              { width: 1024, crop: 'limit' }
            ]
          : [], // No transformation for raw files
      },
      (error, result) => {
        if (error) {
          res.status(500).json({ message: 'Cloudinary upload failed', error });
        } else {
          res.status(200).json({
            url: result?.secure_url,
            originalName: originalname,
            mimeType: mimetype,
            size,
          });
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err });
  }
};
