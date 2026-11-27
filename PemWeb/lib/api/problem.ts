
import { z } from "zod";
import { skemaId } from "@/lib/skema";

export function problem(
  status: number,
  title: string,
  extra: Record<string, unknown> = {}
) {
  return Response.json(
    {
      type: "about:blank",
      title,
      status,
      ...extra,
    },
    {
      status,
      headers: {
        "Content-Type": "application/problem+json",
      },
    }
  );
}

// Validasi isi JSON: 422
export function galatValidasi(error: z.ZodError) {
  const { formErrors, fieldErrors } = z.flattenError(error);

  return problem(422, "Unprocessable Content", {
    detail: formErrors[0] ?? "Data tidak lolos validasi.",
    errors: fieldErrors,
  });
}

// Membaca JSON: 400 jika body rusak
export async function bacaJson(request: Request) {
  try {
    return {
      ok: true as const,
      data: (await request.json()) as unknown,
    };
  } catch {
    return {
      ok: false as const,
      res: problem(400, "Bad Request", {
        detail: "Body harus berupa JSON yang valid.",
      }),
    };
  }
}

// Validasi ID CUID dari params Next.js 16
export async function bacaId(
  params: Promise<{ id: string }>
) {
  const hasil = skemaId.safeParse((await params).id);

  return hasil.success ? hasil.data : null;
}
