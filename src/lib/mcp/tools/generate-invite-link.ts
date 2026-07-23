import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "generate_invite_link",
  title: "Generate guest invitation link",
  description:
    "Generate a unique wedding invitation link for a guest. Returns a URL that opens the personalized invitation page for that guest.",
  inputSchema: {
    baseUrl: z
      .string()
      .url()
      .describe("Base URL of the published wedding site, e.g. https://mywedding.lovable.app"),
    guestName: z
      .string()
      .min(1)
      .describe("Full name of the guest as it should appear on the invitation."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ baseUrl, guestName }) => {
    const guestId = Math.random().toString(36).substring(2, 15);
    const trimmed = baseUrl.replace(/\/$/, "");
    const inviteUrl = `${trimmed}/invite/${guestId}`;
    return {
      content: [
        {
          type: "text",
          text: `Invitation link for ${guestName}: ${inviteUrl}`,
        },
      ],
      structuredContent: { guestId, guestName, inviteUrl },
    };
  },
});
