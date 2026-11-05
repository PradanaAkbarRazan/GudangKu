import type { KeyObject } from "node:crypto";

import {
  signTransaction,
  verifyTransaction,
  type TransactionData,
} from "./signature";

import {
  encryptTransaction,
  decryptTransaction,
  type EncryptedTransaction,
} from "./encryption";

export class SignatureVerificationError extends Error {
  constructor() {
    super("Verifikasi tanda tangan transaksi gagal.");
    this.name = "SignatureVerificationError";
  }
}

// Tugas 1: tanda tangani transaksi.
// Tugas 2: enkripsi transaksi beserta tanda tangannya.
export function signAndEncryptTransaction(
  transaction: TransactionData,
  privateKey: KeyObject,
  encryptionKey: Uint8Array
): EncryptedTransaction {
  const signature = signTransaction(transaction, privateKey);

  return encryptTransaction(
    transaction,
    signature,
    encryptionKey
  );
}

// Tugas 2: dekripsi dan autentikasi paket.
// Tugas 1: verifikasi tanda tangan transaksi.
export function decryptAndVerifyTransaction(
  paket: EncryptedTransaction,
  encryptionKey: Uint8Array,
  publicKey: KeyObject
): TransactionData {
  const { transaction, signature } = decryptTransaction(
    paket,
    encryptionKey
  );

  const isValid = verifyTransaction(
    transaction,
    signature,
    publicKey
  );

  if (!isValid) {
    throw new SignatureVerificationError();
  }

  return transaction;
}