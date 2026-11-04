import { zipSkill } from "@/lib/skill";

export const dynamic = "force-static";

export function GET() {
  return new Response(zipSkill() as unknown as BodyInit, {
    headers: { "Content-Type": "application/zip", "Content-Disposition": 'attachment; filename="isomatric-skill.zip"' },
  });
}
