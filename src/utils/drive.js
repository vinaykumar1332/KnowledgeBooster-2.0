export function extractDriveFileId(url) {
  if (!url) return null;
  const m1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  return null;
}

export function buildDrivePreviewUrl(fileId) {
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
