// Reserved for future upload workflow. The current MVP keeps the file local.
export function createLocalPreview(file) {
  return URL.createObjectURL(file);
}
