import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "send_telegram_notification",
  title: "Send Telegram notification",
  description:
    "Send a message to a Telegram chat via a bot. Useful for testing the wedding RSVP Telegram bot or sending custom notifications.",
  inputSchema: {
    botToken: z
      .string()
      .min(1)
      .describe("Telegram bot token from @BotFather (e.g. 123456:ABC-DEF...)."),
    chatId: z
      .string()
      .min(1)
      .describe("Telegram chat ID that will receive the message."),
    message: z
      .string()
      .min(1)
      .describe("Message text to send. Markdown formatting is supported."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async ({ botToken, chatId, message }) => {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Telegram API error: ${data.description ?? response.statusText}`,
            },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: "Message sent successfully." }],
        structuredContent: { ok: true, messageId: data.result?.message_id },
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Failed to send message: ${msg}` }],
        isError: true,
      };
    }
  },
});
