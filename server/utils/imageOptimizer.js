const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const optimizeImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    let pipeline = sharp(inputPath);

    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }

    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }

    await pipeline.toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'image:', error);
    throw error;
  }
};

const optimizeProfilePhoto = async (inputPath, filename) => {
  const outputDir = 'uploads/profiles';
  const baseName = path.parse(filename).name;

  await fs.mkdir(outputDir, { recursive: true });

  const sizes = {
    original: { width: 400, height: 400 },
    thumbnail: { width: 64, height: 64 }
  };

  const results = {};

  for (const [size, dimensions] of Object.entries(sizes)) {
    const outputFilename = `${baseName}-${size}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    await optimizeImage(inputPath, outputPath, {
      ...dimensions,
      quality: 85,
      format: 'webp'
    });

    results[size] = `/uploads/profiles/${outputFilename}`;
  }

  try {
    await fs.unlink(inputPath);
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier original:', error);
  }

  return results;
};

const optimizeServiceLogo = async (inputPath, filename) => {
  const outputDir = 'uploads/services';
  const baseName = path.parse(filename).name;

  await fs.mkdir(outputDir, { recursive: true });

  const sizes = {
    original: { width: 300, height: 300 },
    thumbnail: { width: 80, height: 80 }
  };

  const results = {};

  for (const [size, dimensions] of Object.entries(sizes)) {
    const outputFilename = `${baseName}-${size}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    await optimizeImage(inputPath, outputPath, {
      ...dimensions,
      quality: 90,
      format: 'webp'
    });

    results[size] = `/uploads/services/${outputFilename}`;
  }

  try {
    await fs.unlink(inputPath);
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier original:', error);
  }

  return results;
};

const deleteImageVariants = async (imagePath) => {
  if (!imagePath) return;

  const baseDir = path.dirname(imagePath);
  const filename = path.basename(imagePath);
  const baseName = filename.replace(/-original\.webp$/, '').replace(/-thumbnail\.webp$/, '');

  const variants = ['original', 'thumbnail'];

  for (const variant of variants) {
    try {
      const variantPath = path.join(process.cwd(), baseDir, `${baseName}-${variant}.webp`);
      await fs.unlink(variantPath);
    } catch (error) {
      // Ignore errors if file doesn't exist
    }
  }
};

module.exports = {
  optimizeImage,
  optimizeProfilePhoto,
  optimizeServiceLogo,
  deleteImageVariants
};
