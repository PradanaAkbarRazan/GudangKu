import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  deriveEncryptionKey,
  KeyInputError,
  loadMasterKey,
} from "../src/key";

describe("Manajemen kunci", () => {
  it("berhasil membaca master key 32 byte", () => {
    const directory = mkdtempSync(join(tmpdir(), "gudangku-"));
    const path = join(directory, "master.key");
    const sampleKey = Buffer.alloc(32, 0x5a);

    try {
      writeFileSync(path, sampleKey.toString("hex"));

      const loadedKey = loadMasterKey(path);

      expect(loadedKey).toEqual(sampleKey);
      expect(loadedKey.length).toBe(32);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("menolak master key dengan format tidak valid", () => {
    const directory = mkdtempSync(join(tmpdir(), "gudangku-"));
    const path = join(directory, "master.key");

    try {
      writeFileSync(path, "format-key-tidak-valid");

      expect(() => loadMasterKey(path)).toThrow(KeyInputError);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("menghasilkan kunci turunan sepanjang 32 byte", () => {
    const masterKey = Buffer.alloc(32, 0x5a);
    const encryptionKey = deriveEncryptionKey(masterKey);

    expect(encryptionKey.length).toBe(32);
  });

  it("menghasilkan kunci turunan yang konsisten", () => {
    const masterKey = Buffer.alloc(32, 0x5a);

    const keyA = deriveEncryptionKey(masterKey);
    const keyB = deriveEncryptionKey(masterKey);

    expect(keyA).toEqual(keyB);
  });

  it("menolak master key dengan panjang yang salah", () => {
    const invalidKey = Buffer.alloc(16);

    expect(() => deriveEncryptionKey(invalidKey)).toThrow(
      KeyInputError
    );
  });
});