import { describe, expect, test } from "vitest";

import {
  generateKeys,
  signTransaction,
  verifyTransaction,
  type TransactionData,
} from "../src/signature";

const transaction: TransactionData = {
  transactionId: "TR001",
  productId: "P001",
  type: "OUT",
  quantity: 10,
  date: "2026-10-08",
};

describe("Digital Signature - GudangKu", () => {
  test("transaksi asli harus menghasilkan signature yang valid", () => {
    const { privateKey, publicKey } = generateKeys();

    const signature = signTransaction(
      transaction,
      privateKey
    );

    const result = verifyTransaction(
      transaction,
      signature,
      publicKey
    );

    expect(result).toBe(true);
  });

  test("transaksi yang diubah harus ditolak", () => {
    const { privateKey, publicKey } = generateKeys();

    const signature = signTransaction(
      transaction,
      privateKey
    );

    const modifiedTransaction: TransactionData = {
      ...transaction,
      quantity: 100,
    };

    const result = verifyTransaction(
      modifiedTransaction,
      signature,
      publicKey
    );

    expect(result).toBe(false);
  });

  test("signature yang diubah harus ditolak", () => {
    const { privateKey, publicKey } = generateKeys();

    const signature = signTransaction(
      transaction,
      privateKey
    );

    const fakeSignature =
      signature.substring(0, signature.length - 2) + "xx";

    const result = verifyTransaction(
      transaction,
      fakeSignature,
      publicKey
    );

    expect(result).toBe(false);
  });

  test("transaksi berbeda harus ditolak", () => {
    const { privateKey, publicKey } = generateKeys();

    const signature = signTransaction(
      transaction,
      privateKey
    );

    const differentTransaction: TransactionData = {
      ...transaction,
      transactionId: "TR002",
    };

    const result = verifyTransaction(
      differentTransaction,
      signature,
      publicKey
    );

    expect(result).toBe(false);
  });
});