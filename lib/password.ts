import crypto from "node:crypto";

const ITERATIONS = 210_000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

function derive(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const key = await derive(password, salt);
  return `pbkdf2$${ITERATIONS}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, iterationsText, saltText, keyText] = stored.split("$");
  if (algorithm !== "pbkdf2" || !iterationsText || !saltText || !keyText) return false;
  const iterations = Number(iterationsText);
  if (!Number.isSafeInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) return false;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(keyText, "base64url");
  const actual = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, expected.length, DIGEST, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}
