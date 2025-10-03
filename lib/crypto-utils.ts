import crypto from "crypto";

const ENCRYPTION_KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY!, "hex");
const ALGORITHM = "aes-256-gcm";

export function encryptField(value: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptField(encrypted?: string): string {
  if (!encrypted) return "";
  try {
    const data = Buffer.from(encrypted, "base64");
    if (data.length < 28) return encrypted;
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const ciphertext = data.slice(28);
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted =
      decipher.update(ciphertext, undefined, "utf8") + decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.warn("Decryption error:", err, "Input:", encrypted);
    return encrypted;
  }
}

// NOTE: decryptMessage is not needed here as it's only used in app\api\auth\decrypt-messages\route.ts