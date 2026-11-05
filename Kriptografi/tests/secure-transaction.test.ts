import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  generateKeys,
} from "../src/signature";

import {
  DecryptionError,
} from "../src/encryption";

import {
  decryptAndVerifyTransaction,
  signAndEncryptTransaction,
  SignatureVerificationError,
} from "../src/secure-transaction";

import type { TransactionData } from "../src/signature";

const transaction: TransactionData = {
  transactionId: "TRX-001",
  productId: "PRD-001",
  type: "IN",
  quantity: 10,
  date: "2026-11-05T10:00:00.000Z",
};

function createFixture() {
  const keyPair = generateKeys();
  const encryptionKey = randomBytes(32);

  const packet = signAndEncryptTransaction(
    transaction,
    keyPair.privateKey,
    encryptionKey
  );

  return {
    keyPair,
    encryptionKey,
    packet,
  };
}

function tamperBase64(value: string): string {
  const bytes = Buffer.from(value, "base64");

  if (bytes.length === 0) {
    throw new Error("Data kosong.");
  }

  bytes[0] ^= 0x01;

  return bytes.toString("base64");
}

describe("Integrasi tanda tangan dan enkripsi transaksi", () => {
  it("berhasil mendekripsi dan memverifikasi transaksi valid", () => {
    const { keyPair, encryptionKey, packet } = createFixture();

    const result = decryptAndVerifyTransaction(
      packet,
      encryptionKey,
      keyPair.publicKey
    );

    expect(result).toEqual(transaction);
  });

  it("menghasilkan nonce berbeda untuk setiap enkripsi", () => {
    const { keyPair, encryptionKey } = createFixture();

    const packetA = signAndEncryptTransaction(
      transaction,
      keyPair.privateKey,
      encryptionKey
    );

    const packetB = signAndEncryptTransaction(
      transaction,
      keyPair.privateKey,
      encryptionKey
    );

    expect(packetA.nonce).not.toBe(packetB.nonce);
  });

  it("menolak ciphertext yang dimodifikasi", () => {
    const { keyPair, encryptionKey, packet } = createFixture();

    const modifiedPacket = {
      ...packet,
      ciphertext: tamperBase64(packet.ciphertext),
    };

    expect(() =>
      decryptAndVerifyTransaction(
        modifiedPacket,
        encryptionKey,
        keyPair.publicKey
      )
    ).toThrow(DecryptionError);
  });

  it("menolak authentication tag yang dimodifikasi", () => {
    const { keyPair, encryptionKey, packet } = createFixture();

    const modifiedPacket = {
      ...packet,
      tag: tamperBase64(packet.tag),
    };

    expect(() =>
      decryptAndVerifyTransaction(
        modifiedPacket,
        encryptionKey,
        keyPair.publicKey
      )
    ).toThrow(DecryptionError);
  });

  it("menolak penggunaan kunci enkripsi yang salah", () => {
    const { keyPair, packet } = createFixture();
    const wrongKey = randomBytes(32);

    expect(() =>
      decryptAndVerifyTransaction(
        packet,
        wrongKey,
        keyPair.publicKey
      )
    ).toThrow(DecryptionError);
  });

  it("menolak perubahan metadata yang digunakan sebagai AAD", () => {
    const { keyPair, encryptionKey, packet } = createFixture();

    const modifiedPacket = {
      ...packet,
      productId: "PRD-999",
    };

    expect(() =>
      decryptAndVerifyTransaction(
        modifiedPacket,
        encryptionKey,
        keyPair.publicKey
      )
    ).toThrow(DecryptionError);
  });

  it("menolak tanda tangan jika public key yang digunakan salah", () => {
    const { encryptionKey, packet } = createFixture();
    const wrongKeyPair = generateKeys();

    expect(() =>
      decryptAndVerifyTransaction(
        packet,
        encryptionKey,
        wrongKeyPair.publicKey
      )
    ).toThrow(SignatureVerificationError);
  });
});