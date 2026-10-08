export function normalizeExternalUrl(value, fallback = '') {
  if (typeof value !== 'string' || !value.trim()) return fallback;

  const trimmedValue = value.trim();
  const urlValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(urlValue);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : fallback;
  } catch {
    return fallback;
  }
}
