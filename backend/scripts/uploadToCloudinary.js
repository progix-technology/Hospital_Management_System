import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Loaded Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Loaded API Key starts with:', process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 4) : 'undefined');

const IMAGES_DIR = path.join(__dirname, '../../frontend/public/images');
const OUTPUT_FILE = path.join(__dirname, 'uploaded_images.json');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const uploadImages = async () => {
  try {
    console.log('Scanning for images in:', IMAGES_DIR);
    const files = getAllFiles(IMAGES_DIR);
    console.log(`Found ${files.length} images. Starting upload...`);

    const uploadedUrls = {};

    for (const file of files) {
      const relativePath = path.relative(IMAGES_DIR, file).replace(/\\/g, '/');
      const folderPath = 'medisphere/' + path.dirname(relativePath);
      
      console.log(`Uploading: ${relativePath}...`);
      
      const result = await cloudinary.uploader.upload(file, {
        folder: folderPath,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      const frontendPath = `/images/${relativePath}`;
      uploadedUrls[frontendPath] = result.secure_url;
      
      console.log(`Uploaded! URL: ${result.secure_url}`);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uploadedUrls, null, 2));
    console.log(`\n✅ Upload complete! Mapping saved to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error uploading images:', error);
  }
};

uploadImages();
