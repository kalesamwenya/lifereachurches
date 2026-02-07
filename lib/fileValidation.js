export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 2;

export function getImageSizeErrorMessage() {
  return `Image must be ${MAX_IMAGE_SIZE_MB}MB or less.`;
}

export function isImageSizeValid(file) {
  return !!file && file.size <= MAX_IMAGE_SIZE_BYTES;
}
