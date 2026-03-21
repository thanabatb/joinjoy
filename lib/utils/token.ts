export function generateShareToken(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let token = "";

  for (let index = 0; index < 10; index += 1) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return token;
}
