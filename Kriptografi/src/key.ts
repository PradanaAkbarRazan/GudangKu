
import { hkdfSync } from "node:crypto";
import { readFileSync } from "node:fs";

const MASTER_KEY_LENGTH = 32;
const ENCRYPTION_KEY_LENGTH = 32;

const HKDF_INFO = Buffer.from(
  "GudangKu:v0.2:AES-256-GCM",
  "utf8"
);

export class KeyInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KeyInputError";
  }
}

export function loadMasterKey(filePath: string): Buffer {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    throw new KeyInputError("Lokasi berkas kunci tidak valid.");
  }

  let encoded: string;

  try {
    encoded = readFileSync(filePath, "utf8").trim();
  } catch {
    throw new KeyInputError("Berkas master key tidak dapat dibaca.");
  }

  if (!/^[a-fA-F0-9]{64}$/.test(encoded)) {
    throw new KeyInputError("Format master key tidak valid.");
  }

  const key = Buffer.from(encoded, "hex");

  if (key.length !== MASTER_KEY_LENGTH) {
    throw new KeyInputError("Panjang master key tidak valid.");
  }

  return key;
}

export function deriveEncryptionKey(
  masterKey: Uint8Array
): Buffer {
  if (
    !(masterKey instanceof Uint8Array) ||
    masterKey.length !== MASTER_KEY_LENGTH
  ) {
    throw new KeyInputError(
      "Master key harus berukuran 32 byte."
    );
  }

  const derivedKey = hkdfSync(
    "sha256",
    masterKey,
    Buffer.alloc(0),
    HKDF_INFO,
    ENCRYPTION_KEY_LENGTH
  );

  return Buffer.from(derivedKey);
}
