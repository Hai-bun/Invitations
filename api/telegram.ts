// Admin "Test" button: sends a message with the token/chat typed in the form.
// Only a signed-in Supabase user may call it, so it is not an open relay.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, description: "Method not allowed" });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const auth = String(req.headers?.authorization || "");
  if (!url || !anon || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, description: "Sign in to Admin first" });
  }
  const who = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: auth } });
  if (!who.ok) return res.status(401).json({ ok: false, description: "Sign in to Admin first" });

  const { botToken, chatId, text } = req.body ?? {};
  if (
    typeof botToken !== "string" ||
    !/^\d{5,}:[A-Za-z0-9_-]{20,}$/.test(botToken.trim()) ||
    !chatId ||
    typeof text !== "string" ||
    text.length > 4000
  ) {
    return res.status(400).json({
      ok: false,
      description: "Bot token must look like 123456789:AAxxxx (include the number and colon) and Chat ID is required",
    });
  }
  try {
    const tg = await fetch(`https://api.telegram.org/bot${botToken.trim()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: String(chatId).trim(), text, parse_mode: "HTML" }),
    });
    const body = await tg.json().catch(() => ({}));
    return res.status(tg.ok ? 200 : 502).json({
      ok: tg.ok,
      description: body?.description ?? (tg.ok ? "sent" : `Telegram error ${tg.status}`),
    });
  } catch {
    return res.status(502).json({ ok: false, description: "Server could not reach Telegram" });
  }
}
