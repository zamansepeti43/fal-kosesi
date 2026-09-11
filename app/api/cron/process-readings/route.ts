import { processQueuedReadings } from "@/lib/fortune/queue-worker";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  // Vercel recommends CRON_SECRET for authenticated cron invocations. During setup,
  // also accept Vercel's cron schedule header so the feature can run before the secret
  // is configured; once CRON_SECRET exists, the secret becomes mandatory.
  if (cronSecret) {
    if (authorization !== `Bearer ${cronSecret}`) return new Response("Unauthorized", { status: 401 });
  } else if (!request.headers.get("x-vercel-cron-schedule")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const processed = await processQueuedReadings(3);
    return Response.json({ ok: true, processed });
  } catch (error) {
    console.error("Fortune cron error:", error);
    return Response.json({ ok: false, error: "Kuyruk işlenemedi." }, { status: 500 });
  }
}
