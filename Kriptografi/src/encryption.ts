
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

import type { TransactionData } from "./signature";

const ALGORITHM = "aes-256-gcm";
const VERSION = 1;

const KEY_LENGTH = 32;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;

export interface EncryptedTransaction {
  version: 1;
  algorithm: "aes-256-gcm";
  transactionId: string;
  productId: string;
  nonce: string;
  ciphertext: string;
  tag: string;
}

export interface DecryptedTransaction {
  transaction: TransactionData;
  signature: string;
}

export class EncryptionInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EncryptionInputError";
  }
}

export class DecryptionError extends Error {
  constructor() {
    super("Paket tidak valid atau autentikasi gagal.");
    this.name = "DecryptionError";
  }
}

function validateKey(key: Uint8Array): void {
  if (!(key instanceof Uint8Array) || key.length !== KEY_LENGTH) {
    throw new EncryptionInputError(
      "Kunci AES-256 harus berukuran 32 byte."
    );
  }
}

function validateTransaction(
  transaction: TransactionData
): void {
  if (!transaction || typeof transaction !== "object") {
    throw new EncryptionInputError("Data transaksi tidak valid.");
  }

  if (
    typeof transaction.transactionId !== "string" ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(transaction.transactionId)
  ) {
    throw new EncryptionInputError("ID transaksi tidak valid.");
  }

  if (
    typeof transaction.productId !== "string" ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(transaction.productId)
  ) {
    throw new EncryptionInputError("ID produk tidak valid.");
  }

  if (transaction.type !== "IN" && transaction.type !== "OUT") {
    throw new EncryptionInputError("Jenis transaksi tidak valid.");
  }

  if (
    !Number.isSafeInteger(transaction.quantity) ||
    transaction.quantity <= 0
  ) {
    throw new EncryptionInputError("Jumlah transaksi tidak valid.");
  }

  if (
    typeof transaction.date !== "string" ||
    transaction.date.length > 40 ||
    !Number.isFinite(Date.parse(transaction.date))
  ) {
    throw new EncryptionInputError("Tanggal transaksi tidak valid.");
  }
}

function validateSignature(signature: string): void {
  if (typeof signature !== "string") {
    throw new EncryptionInputError("Signature tidak valid.");
  }

  const decoded = decodeBase64(signature);

  if (decoded.length !== 64) {
    throw new EncryptionInputError("Panjang signature tidak valid.");
  }
}

function decodeBase64(value: string): Buffer {
  if (
    typeof value !== "string" ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      value
    )
  ) {
    throw new DecryptionError();
  }

  const decoded = Buffer.from(value, "base64");

  if (decoded.toString("base64") !== value) {
    throw new DecryptionError();
  }

  return decoded;
}

function createAAD(
  transactionId: string,
  productId: string
): Buffer {
  return Buffer.from(
    `GudangKu:v${VERSION}:transaction:${transactionId}:product:${productId}`,
    "utf8"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function encryptTransaction(
  transaction: TransactionData,
  signature: string,
  key: Uint8Array
): EncryptedTransaction {
  validateKey(key);
  validateTransaction(transaction);
  validateSignature(signature);

  // Nonce baru dibuat menggunakan CSPRNG setiap enkripsi.
  const nonce = randomBytes(NONCE_LENGTH);

  // ID transaksi dan produk ikut diautentikasi sebagai AAD.
  const aad = createAAD(
    transaction.transactionId,
    transaction.productId
  );

  const payload = JSON.stringify({
    transaction: {
      transactionId: transaction.transactionId,
      productId: transaction.productId,
      type: transaction.type,
      quantity: transaction.quantity,
      date: transaction.date,
    },
    signature,
  });

  const cipher = createCipheriv(
    ALGORITHM,
    key,
    nonce,
    { authTagLength: TAG_LENGTH }
  );

  cipher.setAAD(aad);

  const ciphertext = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    version: VERSION,
    algorithm: ALGORITHM,
    transactionId: transaction.transactionId,
    productId: transaction.productId,
    nonce: nonce.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptTransaction(
  paket: EncryptedTransaction,
  key: Uint8Array
): DecryptedTransaction {
  try {
    validateKey(key);

    if (!isRecord(paket)) {
      throw new Error("Paket tidak valid.");
    }

    const allowedFields = [
      "version",
      "algorithm",
      "transactionId",
      "productId",
      "nonce",
      "ciphertext",
      "tag",
    ];

    if (
      Object.keys(paket).length !== allowedFields.length ||
      !allowedFields.every((field) =>
        Object.hasOwn(paket, field)
      )
    ) {
      throw new Error("Struktur paket tidak valid.");
    }

    if (
      paket.version !== VERSION ||
      paket.algorithm !== ALGORITHM ||
      typeof paket.transactionId !== "string" ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(paket.transactionId) ||
      typeof paket.productId !== "string" ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(paket.productId) ||
      typeof paket.nonce !== "string" ||
      typeof paket.ciphertext !== "string" ||
      typeof paket.tag !== "string"
    ) {
      throw new Error("Parameter paket tidak valid.");
    }

    const nonce = decodeBase64(paket.nonce);
    const ciphertext = decodeBase64(paket.ciphertext);
    const tag = decodeBase64(paket.tag);

    if (
      nonce.length !== NONCE_LENGTH ||
      ciphertext.length === 0 ||
      ciphertext.length > 1_000_000 ||
      tag.length !== TAG_LENGTH
    ) {
      throw new Error("Panjang paket tidak valid.");
    }

    const aad = createAAD(
      paket.transactionId,
      paket.productId
    );

    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      nonce,
      { authTagLength: TAG_LENGTH }
    );

    decipher.setAAD(aad);
    decipher.setAuthTag(tag);

    // Plaintext hanya dikembalikan setelah autentikasi berhasil.
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    const data: unknown = JSON.parse(
      plaintext.toString("utf8")
    );

    if (!isRecord(data) || !isRecord(data.transaction)) {
      throw new Error("Isi transaksi tidak valid.");
    }

    const transaction = data.transaction as unknown as TransactionData;
    const signature = data.signature;

    validateTransaction(transaction);
    validateSignature(signature as string);

    if (
      transaction.transactionId !== paket.transactionId ||
      transaction.productId !== paket.productId
    ) {
      throw new Error("Konteks transaksi tidak sesuai.");
    }

    return {
      transaction,
      signature: signature as string,
    };
  } catch {
    // Tidak mengembalikan plaintext jika autentikasi gagal.
    throw new DecryptionError();
  }
}
