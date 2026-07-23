import { defineMcp } from "@lovable.dev/mcp-js";
import generateInviteLink from "./tools/generate-invite-link";
import sendTelegramNotification from "./tools/send-telegram-notification";
import buildMapEmbed from "./tools/build-map-embed";

export default defineMcp({
  name: "wedding-invitation-mcp",
  title: "Wedding Invitation MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Wedding Invitation app. Use `generate_invite_link` to create personalized guest invitation URLs, `send_telegram_notification` to test or send Telegram RSVP notifications, and `build_map_embed` to turn Google Maps URLs or addresses into embeddable map URLs.",
  tools: [generateInviteLink, sendTelegramNotification, buildMapEmbed],
});
