/**
 * Default authentic digital signature for Swarnali Dey (General Manager Admin & HR)
 * Official high-resolution transparent PNG asset.
 */
export const defaultSwarnaliDeySignature =
  'https://0e8dtpaport9ku82.public.blob.vercel-storage.com/swarnali-signature-emsurg.png';

/**
 * Default official company seal stamp for Emsurg Healthcare India Pvt. Ltd.
 * Official circular seal transparent PNG asset.
 */
export const defaultEmsurgStamp =
  'https://0e8dtpaport9ku82.public.blob.vercel-storage.com/stamp-emsurghr.png';

/**
 * Utility to convert an uploaded image file (PNG, JPG, SVG) into a base64 Data URL.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
