import "dotenv/config";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

async function fetchImageAsBase64(url: string) {
    console.log(`Processing ${url}...`);
    let buffer: Buffer;

    if (url.startsWith("/")) {
        const filePath = path.join(process.cwd(), "public", url);
        console.log(`Reading local file: ${filePath}`);
        buffer = await fs.readFile(filePath);
    } else {
        console.log(`Fetching remote URL`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
        const arrayBuffer = await res.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    }

    console.log(`Original size: ${buffer.length} bytes`);

    const resizedBuffer = await sharp(buffer)
        .resize(1024, 1024, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();

    console.log(`Resized size: ${resizedBuffer.length} bytes`);
    return resizedBuffer.toString("base64");
}

async function main() {
    try {
        // Test with local mannequin
        await fetchImageAsBase64("/mannequin-male.png");
        console.log("✅ Local image processing successful");

        // Test with remote image (placeholder)
        await fetchImageAsBase64("https://placehold.co/600x400.png");
        console.log("✅ Remote image processing successful");
    } catch (error) {
        console.error("❌ Image processing failed:", error);
    }
}

main();
