import { NextRequest, NextResponse } from "next/server";
import { stat, createReadStream } from "fs";
import { promisify } from "util";
import path from "path";
import { existsSync } from "fs";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

const statAsync = promisify(stat);

function nodeStreamToWeb(readable: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readable.on("data", (chunk) => controller.enqueue(chunk));
      readable.on("end", () => controller.close());
      readable.on("error", (err) => controller.error(err));
    },
    cancel() {
      readable.destroy();
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileStat = await statAsync(filePath);
    const fileSize = fileStat.size;
    const range = request.headers.get("range");

    // Infer content type
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".glb": "model/gltf-binary",
      ".gltf": "model/gltf+json",
    };
    const contentType = mimeMap[ext] || "application/octet-stream";

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fileStream = createReadStream(filePath, { start, end });
      const webStream = nodeStreamToWeb(fileStream);

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
        },
      });
    } else {
      const fileStream = createReadStream(filePath);
      const webStream = nodeStreamToWeb(fileStream);

      return new NextResponse(webStream, {
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
        },
      });
    }
  } catch (error) {
    console.error("Media streaming error:", error);
    return NextResponse.json(
      { error: "Error streaming file", details: String(error) },
      { status: 500 }
    );
  }
}
