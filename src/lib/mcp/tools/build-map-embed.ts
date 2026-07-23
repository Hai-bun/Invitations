import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "build_map_embed",
  title: "Build Google Maps embed URL",
  description:
    "Convert a shared Google Maps URL or address into an embeddable map URL suitable for the wedding location section.",
  inputSchema: {
    input: z
      .string()
      .min(1)
      .describe(
        "A Google Maps URL (share link, place URL, or embed URL) OR a venue address string.",
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ input }) => {
    const value = input.trim();
    let embedUrl = "";

    if (value.includes("/embed")) {
      embedUrl = value;
    } else {
      try {
        const url = new URL(value);
        const coordMatch = value.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        const placeMatch = value.match(/place\/([^/]+)/);
        const query =
          url.searchParams.get("q") ??
          (placeMatch ? decodeURIComponent(placeMatch[1].replace(/\+/g, " ")) : null) ??
          (coordMatch ? `${coordMatch[1]},${coordMatch[2]}` : null);
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query ?? value)}&output=embed`;
      } catch {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;
      }
    }

    return {
      content: [{ type: "text", text: embedUrl }],
      structuredContent: { embedUrl },
    };
  },
});
