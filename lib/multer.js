
// lib/upload.js
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function parseForm(req) {
  const uploadDir = path.join(process.cwd(), 'public/uploads/images');
  
  // Ensure upload directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: ({ mimetype }) => {
      return mimetype && mimetype.startsWith('image/');
    },
    filename: (name, ext, part) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `${part.name}-${uniqueSuffix}${ext}`;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// API route example: pages/api/upload.js or app/api/upload/route.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return file info
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: file.newFilename,
      path: `/uploads/images/${file.newFilename}`,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}
