// Server-side relay for Telegram's sendMessage. Browsers on some networks
// cannot reach api.telegram.org directly; Vercel's servers always can.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, description: "Method not allowed" });
    return;
  }
  const { botToken, chatId, text } = req.body ?? {};
  if (
    typeof botToken !== "string" ||
    !/^\d{5,}:[A-Za-z0-9_-]{20,}$/.test(botToken) ||
    !chatId ||
    typeof text !== "string" ||
    text.length > 4000
  ) {
    res.status(400).json({ ok: false, description: "Invalid bot token, chat ID or message" });
    return;
  }
  try {
    const tg = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const body = await tg.json().catch(() => ({}));
    res.status(tg.ok ? 200 : 502).json({
      ok: tg.ok,
      description: body?.description ?? (tg.ok ? "sent" : `Telegram error ${tg.status}`),
    });
  } catch {
    res.status(502).json({ ok: false, description: "Server could not reach Telegram" });
  }
}
