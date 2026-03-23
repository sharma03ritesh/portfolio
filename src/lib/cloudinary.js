const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Open Cloudinary upload widget.
 * @param {'image'|'raw'} resourceType - 'raw' for PDF, 'image' for images
 * @param {function} onSuccess - callback(secureUrl)
 */
export function openUploadWidget(resourceType = 'image', onSuccess) {
  if (!window.cloudinary) {
    alert('Cloudinary widget script not loaded. Check index.html.');
    return;
  }
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    alert('Cloudinary env vars missing. Fill VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      resourceType: 'raw',
      accessControl: 'public',
      sources: ['local', 'url'],
      multiple: false,
      clientAllowedFormats: resourceType === 'raw' ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    },
    (error, result) => {
      if (!error && result?.event === 'success') {
        onSuccess(result.info.secure_url);
      }
    }
  );
  widget.open();
}
