
import * as argon2 from "argon2";

const OPSI_HASH = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  raw: false,
} as const;

export async function hashKataSandi(
  kataSandi: string
): Promise<string> {
  return argon2.hash(kataSandi, OPSI_HASH);
}

export async function verifikasiKataSandi(
  hash: string,
  kataSandi: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, kataSandi);
  } catch {
    return false;
  }
}
