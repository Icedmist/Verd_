/**
 * Utility to compress images locally using Canvas before upload.
 */
export const compressImage = (file: File, maxWidth = 800, maxWeightKB = 500): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
        
        ctx.drawImage(img, 0, 0, width, height);

        // Recursive compression attempt
        let quality = 0.8;
        const attemptCompression = () => {
          canvas.toBlob((blob) => {
            if (!blob) return reject('Blob creation failed');
            if (blob.size / 1024 > maxWeightKB && quality > 0.1) {
              quality -= 0.1;
              attemptCompression();
            } else {
              resolve(blob);
            }
          }, 'image/jpeg', quality);
        };

        attemptCompression();
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
};
