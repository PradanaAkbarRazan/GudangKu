import {
  generateKeyPairSync,
  sign,
  verify,
  type KeyObject,
} from "node:crypto";

export interface TransactionData {
  transactionId: string;
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  date: string;
}

export interface KeyPair {
  publicKey: KeyObject;
  privateKey: KeyObject;
}

export function generateKeys(): KeyPair {
  return generateKeyPairSync("ed25519");
}

export function createTransactionMessage(
  transaction: TransactionData
): string {
  return JSON.stringify({
    transactionId: transaction.transactionId,
    productId: transaction.productId,
    type: transaction.type,
    quantity: transaction.quantity,
    date: transaction.date,
  });
}

export function signTransaction(
  transaction: TransactionData,
  privateKey: KeyObject
): string {
  const message = createTransactionMessage(transaction);

  const signature = sign(
    null,
    Buffer.from(message, "utf8"),
    privateKey
  );

  return signature.toString("base64");
}

export function verifyTransaction(
  transaction: TransactionData,
  signatureBase64: string,
  publicKey: KeyObject
): boolean {
  const message = createTransactionMessage(transaction);
  const signature = Buffer.from(signatureBase64, "base64");

  return verify(
    null,
    Buffer.from(message, "utf8"),
    publicKey,
    signature
  );
}