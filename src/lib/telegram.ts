const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface TelegramResult {
  ok: boolean;
  error?: string;
}

// Sends through our own /api/telegram relay first (works even where the guest's
// network blocks api.telegram.org), then falls back to calling Telegram directly.
export const sendTelegramMessage = async (
  botToken: string,
  chatId: string,
  html: string,
): Promise<TelegramResult> => {
  let relayError = "";
  try {
    const res = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botToken: botToken.trim(), chatId: String(chatId).trim(), text: html }),
    });
    const type = res.headers.get("content-type") ?? "";
    if (type.includes("application/json")) {
      const body = await res.json();
      if (body.ok) return { ok: true };
      relayError = body.description || "Telegram rejected the message";
      // A real Telegram answer (bad token / chat) will not improve by retrying.
      if (res.status !== 502 || !/reach/i.test(relayError)) return { ok: false, error: relayError };
    }
  } catch {
    /* relay unavailable (e.g. local dev) - try direct */
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken.trim()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: String(chatId).trim(), text: html, parse_mode: "HTML" }),
    });
    const body = await res.json().catch(() => ({}));
    return res.ok ? { ok: true } : { ok: false, error: body?.description || `Telegram error ${res.status}` };
  } catch {
    return { ok: false, error: relayError || "Could not connect to Telegram (network blocked?)" };
  }
};

export const telegramEscape = escapeHtml;
