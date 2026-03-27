import { getSettings } from './settings';

/**
 * Open Cloudinary upload widget.
 * Settings are loaded from the DB (site_settings table) first,
 * falling back to VITE_* env vars if not set.
 *
 * @param {'image'|'raw'} resourceType - 'raw' for PDF, 'image' for images
 * @param {function} onSuccess - callback(secureUrl)
 */
export async function openUploadWidget(resourceType = 'image', onSuccess) {
  if (!window.cloudinary) {
    alert('Cloudinary widget script not loaded. Check index.html.');
    return;
  }

  // Resolve settings: DB first, then env vars
  const settings = await getSettings();
  const cloudName =
    settings.cloudinary_cloud_name || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    settings.cloudinary_upload_preset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    alert(
      'Cloudinary is not configured.\n\nSet the values in Admin → Settings, or add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.'
    );
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName,
      uploadPreset,
      resourceType: 'raw',
      accessControl: 'public',
      sources: ['local', 'url'],
      multiple: false,
      clientAllowedFormats:
        resourceType === 'raw'
          ? ['pdf']
          : ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    },
    (error, result) => {
      if (!error && result?.event === 'success') {
        onSuccess(result.info.secure_url);
      }
    }
  );
  widget.open();
}
