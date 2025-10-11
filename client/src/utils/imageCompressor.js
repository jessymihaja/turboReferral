export const compressImage = (file, maxSizeMB = 1, maxWidthOrHeight = 1920) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = height * (maxWidthOrHeight / width);
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = width * (maxWidthOrHeight / height);
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Generate filename with .webp extension
        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const webpFilename = `${originalName}.webp`;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const maxSizeBytes = maxSizeMB * 1024 * 1024;

              if (blob.size <= maxSizeBytes) {
                // Add filename property to blob for FormData
                blob.name = webpFilename;
                blob.lastModified = Date.now();
                resolve(blob);
              } else {
                const compressionRatio = maxSizeBytes / blob.size;
                const quality = Math.max(0.5, Math.min(0.95, compressionRatio));

                canvas.toBlob(
                  (reducedBlob) => {
                    if (reducedBlob) {
                      // Add filename property to blob for FormData
                      reducedBlob.name = webpFilename;
                      reducedBlob.lastModified = Date.now();
                      resolve(reducedBlob);
                    } else {
                      reject(new Error('Erreur lors de la compression'));
                    }
                  },
                  'image/webp',
                  quality
                );
              }
            } else {
              reject(new Error('Erreur lors de la compression'));
            }
          },
          'image/webp',
          0.85
        );
      };

      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
  });
};

export const compressProfilePhoto = (file) => {
  return compressImage(file, 0.5, 800);
};

export const compressServiceLogo = (file) => {
  return compressImage(file, 0.3, 600);
};
