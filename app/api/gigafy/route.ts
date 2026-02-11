import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const replicate = new Replicate();

export async function POST(req: NextRequest) {
  try {
    // Validate API token is configured
    if (
      !process.env.REPLICATE_API_TOKEN ||
      process.env.REPLICATE_API_TOKEN === "your_replicate_api_token_here"
    ) {
      return NextResponse.json(
        {
          error:
            "Replicate API token is not configured. Add it to .env.local",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert the uploaded file to a base64 data URI for the prompt context
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = imageFile.type || "image/png";
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Use flux-kontext-pro to edit the image while preserving the person's likeness
    const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
      input: {
        prompt:
          "Transform this person into a hyper-masculine GigaChad meme version " +
          "while keeping the same facial features and identity. " +
          "Give them an extremely chiseled jawline, prominent cheekbones, " +
          "deep-set intense eyes, thick eyebrows, a perfectly sculpted face, " +
          "and a strong muscular neck. Keep the same pose, expression, and background. " +
          "Photorealistic, cinematic lighting, dramatic shadows, sharp focus.",
        input_image: dataUri,
        aspect_ratio: "1:1",
      },
    });

    // The output from imagen-4 is typically a ReadableStream or a URL
    let resultUrl: string;

    if (typeof output === "string") {
      resultUrl = output;
    } else if (
      output &&
      typeof output === "object" &&
      "url" in (output as Record<string, unknown>)
    ) {
      resultUrl = (output as Record<string, unknown>).url as string;
    } else if (output instanceof ReadableStream) {
      // Collect the stream into a base64 data URI
      const reader = output.getReader();
      const chunks: Uint8Array[] = [];
      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (result.value) {
          chunks.push(result.value);
        }
      }
      const totalLength = chunks.reduce(
        (acc, chunk) => acc + chunk.length,
        0
      );
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      const resultBase64 = Buffer.from(combined).toString("base64");
      resultUrl = `data:image/png;base64,${resultBase64}`;
    } else {
      resultUrl = String(output);
    }

    return NextResponse.json({ url: resultUrl });
  } catch (error) {
    console.error("Gigafy API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
