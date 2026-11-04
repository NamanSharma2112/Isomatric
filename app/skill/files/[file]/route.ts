import { SKILL_FILES, readSkillFile } from "@/lib/skill";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SKILL_FILES.map((f) => ({ file: f.name }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const f = SKILL_FILES.find((x) => x.name === file);
  if (!f) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(readSkillFile(f.path)), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `inline; filename="${f.name}"` },
  });
}
