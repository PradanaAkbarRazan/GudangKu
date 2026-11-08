import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      role: true,
      passwordHash: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  if (users.length === 0) {
    console.log("Belum ada akun di database.");
    return;
  }

  const hasil = users.map((user) => {
    const [, algoritma, versi, parameter] =
      user.passwordHash.split("$");

    return {
      role: user.role,
      algoritma,
      versi,
      parameter,
      hashTersimpan: user.passwordHash.startsWith("$argon2id$"),
      hashDirahasiakan: true,
    };
  });

  console.table(hasil);
}

main()
  .catch((error: unknown) => {
    console.error("Verifikasi gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });