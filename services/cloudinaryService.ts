
import { getUploadConfig } from './firebaseService';

const DEFAULT_CLOUD_NAME = 'dkd5jmq2d';
const DEFAULT_UPLOAD_PRESET = 'HQ Travels';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const config = await getUploadConfig();

    if (config?.provider === 'cpanel' && config.cpanelUrl) {
      // Upload to cPanel
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(config.cpanelUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('cPanel Upload failed');
      }

      const data = await response.json();
      if (data.success && data.url) {
          return data.url;
      } else {
          throw new Error(data.message || 'cPanel Upload failed');
      }
    } else {
      // Fallback to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      const preset = config?.cloudinaryPreset || DEFAULT_UPLOAD_PRESET;
      const url = config?.cloudinaryUrl || `https://api.cloudinary.com/v1_1/${DEFAULT_CLOUD_NAME}/image/upload`;
      
      formData.append('upload_preset', preset);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || 'Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    }
  } catch (error) {
    console.error("Image upload error", error);
    throw error;
  }
};
