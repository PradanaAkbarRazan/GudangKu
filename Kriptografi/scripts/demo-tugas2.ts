import { homedir } from "node:os";
import { join } from "node:path";

import { generateKeys } from "../src/signature";
import {
  loadMasterKey,
  deriveEncryptionKey,
} from "../src/key";
import {
  signAndEncryptTransaction,
  decryptAndVerifyTransaction,
} from "../src/secure-transaction";

function main(): void {
  const keyPath =
    process.env.GUDANGKU_MASTER_KEY_PATH?.trim() ||
    join(homedir(), ".gudangku", "master.key");

  // Membaca master key dari luar repository.
  const masterKey = loadMasterKey(keyPath);
  const encryptionKey = deriveEncryptionKey(masterKey);

  try {
    // Key pair Ed25519 dibuat untuk demonstrasi.
    const { privateKey, publicKey } = generateKeys();

    // Data transaksi sintetis.
    const transaction = {
      transactionId: "DEMO-001",
      productId: "PRODUK-001",
      type: "IN" as const,
      quantity: 15,
      date: "2026-11-05T10:00:00.000Z",
    };

    // Tugas 1 + Tugas 2: tanda tangan dan enkripsi.
    const packet = signAndEncryptTransaction(
      transaction,
      privateKey,
      encryptionKey
    );

    // Dekripsi dan verifikasi.
    const result = decryptAndVerifyTransaction(
      packet,
      encryptionKey,
      publicKey
    );

    console.log("=== DEMO GUDANGKU TUGAS 2 ===");
    console.log("Master key berhasil dibaca.");
    console.log("HKDF-SHA256 berhasil menurunkan kunci enkripsi.");
    console.log(`Algoritma: ${packet.algorithm}`);
    console.log(
      `Panjang nonce: ${Buffer.from(packet.nonce, "base64").length} byte`
    );
    console.log(
      `Panjang authentication tag: ${Buffer.from(packet.tag, "base64").length} byte`
    );
    console.log("Enkripsi dan dekripsi: BERHASIL");
    console.log("Verifikasi Ed25519: BERHASIL");
    console.log("Transaksi hasil verifikasi:");
    console.log(result);
  } finally {
    // Menghapus material kunci dari buffer setelah demo.
    masterKey.fill(0);
    encryptionKey.fill(0);
  }
}

try {
  main();
} catch (error) {
  console.error(
    "Demo gagal:",
    error instanceof Error ? error.message : "Terjadi kesalahan."
  );
  process.exitCode = 1;
}