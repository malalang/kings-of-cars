import { revalidationPayloadSchema } from "@kings-of-cars/contracts/revalidation";
import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = revalidationPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { tags, paths, tag, path, mode } = parsed.data;

  for (const value of tags ?? []) {
    revalidateTag(value, mode === "immediate" ? { expire: 0 } : "max");
  }
  if (tag) {
    revalidateTag(tag, mode === "immediate" ? { expire: 0 } : "max");
  }
  for (const value of paths ?? []) {
    revalidatePath(value);
  }
  if (path) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
