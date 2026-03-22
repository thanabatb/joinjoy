export function normalizeShareToken(rawShareToken: string) {
  const decodedToken = decodeURIComponent(rawShareToken).trim();
  return decodedToken.split(/\s+/)[0] ?? decodedToken;
}
