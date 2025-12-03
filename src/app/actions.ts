"use server";

import { db } from "@/db";
import { clothingItems, bodyProfiles, outfits } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function saveClothingItem(data: {
    imageUrl: string;
    category: "top" | "bottom" | "shoes" | "accessory" | "outerwear";
    subCategory?: string;
    description?: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.insert(clothingItems).values({
        userId,
        imageUrl: data.imageUrl,
        category: data.category,
        subCategory: data.subCategory,
        description: data.description,
    });

    revalidatePath("/dashboard");
}

export async function saveClothingItems(items: {
    imageUrl: string;
    category: "top" | "bottom" | "shoes" | "accessory" | "outerwear";
    subCategory?: string;
    description?: string;
}[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (items.length === 0) return;

    await db.insert(clothingItems).values(
        items.map(item => ({
            userId,
            imageUrl: item.imageUrl,
            category: item.category,
            subCategory: item.subCategory,
            description: item.description,
        }))
    );

    revalidatePath("/dashboard");
}

export async function saveBodyProfile(data: { imageUrl: string; name?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.insert(bodyProfiles).values({
        userId,
        imageUrl: data.imageUrl,
        name: data.name || "My Profile",
    });

    revalidatePath("/dashboard/account");
}

export async function getBodyProfiles() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const profiles = await db.query.bodyProfiles.findMany({
        where: eq(bodyProfiles.userId, userId),
        orderBy: (profiles, { desc }) => [desc(profiles.createdAt)],
    });

    // Add default mannequins
    const mannequins = [
        {
            id: "mannequin-male",
            userId: "system",
            imageUrl: "/mannequin-male.png",
            name: "Male Mannequin",
            isDefault: "true",
            createdAt: new Date(),
        },
        {
            id: "mannequin-female",
            userId: "system",
            imageUrl: "/mannequin-female.png",
            name: "Female Mannequin",
            isDefault: "true",
            createdAt: new Date(),
        }
    ];

    return [...profiles, ...mannequins];
}

export async function deleteBodyProfile(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const profile = await db.query.bodyProfiles.findFirst({
        where: and(eq(bodyProfiles.id, id), eq(bodyProfiles.userId, userId)),
    });

    if (!profile) return;

    if (profile.imageUrl.includes("utfs.io")) {
        const key = profile.imageUrl.split("/").pop();
        if (key) await utapi.deleteFiles(key);
    }

    await db.delete(bodyProfiles).where(and(eq(bodyProfiles.id, id), eq(bodyProfiles.userId, userId)));
    revalidatePath("/dashboard/account");
}

export async function getClothingItems() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const items = await db.query.clothingItems.findMany({
        where: eq(clothingItems.userId, userId),
        orderBy: (items, { desc }) => [desc(items.createdAt)],
    });

    return items;
}

export async function generateOutfit(data: { occasion: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check usage limits
    const { checkGenerationLimit, incrementGenerations } = await import("./actions/user-actions");
    const limitCheck = await checkGenerationLimit();

    if (!limitCheck.canGenerate) {
        throw new Error(`You've reached your monthly limit of outfit generations. Upgrade your plan to continue!`);
    }

    // 1. Fetch user's closet
    const closetItems = await db.query.clothingItems.findMany({
        where: eq(clothingItems.userId, userId),
    });

    if (closetItems.length === 0) {
        throw new Error("Closet is empty! Upload some clothes first.");
    }

    // 2. Ask Gemini to select items
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Shuffle items to prevent bias towards the first items in the list
    const shuffledItems = [...closetItems].sort(() => Math.random() - 0.5);

    const prompt = `
    You are a creative personal stylist. 
    ABSOLUTELY DO NOT ADD ANYTHING THAT IS NOT IN THE "Available Closet Items" list. OR YOU WILL KILL ME!
    You are creative but not funny, your goal is to create the best outfit for the occasion.
    Occasion: "${data.occasion}"
    
    Available Closet Items (JSON):
    ${JSON.stringify(shuffledItems.map(i => ({ id: i.id, category: i.category, subCategory: i.subCategory, description: i.description })))}
    
    STRICT RULE: You must ONLY select items from the "Available Closet Items" list above. Do NOT invent or suggest any items that are not in this list.
    
    Select the best outfit for this occasion using the available items.
    IMPORTANT: Be creative! Don't just pick the most obvious items. Try to create a unique and stylish combination.
    ABSOLUTELY DO NOT ADD ANYTHING THAT IS NOT IN THE "Available Closet Items" list. OR YOU WILL GET A BAD GRADE!
    DO NOT ADD WATCHES OR ANY ACCESSORIES TO THE OUTFIT UNLESS IT IS IN THE "Available Closet Items" list.
    Return ONLY a JSON object with the following structure:
    {
      "selectedItemIds": ["id1", "id2", ...],
      "reasoning": "Why this outfit works..."
    }
  `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const selection = JSON.parse(jsonStr);

    // Validate that selected items actually exist in the closet
    const validSelectedIds = selection.selectedItemIds.filter((id: string) =>
        closetItems.some(item => item.id === id)
    );

    const selectedItems = closetItems.filter(i => validSelectedIds.includes(i.id));

    return {
        selection: {
            ...selection,
            selectedItemIds: validSelectedIds
        },
        closetItems: selectedItems,
    };
}

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

// ...

export async function generateTryOn(data: {
    items: { id: string; imageUrl: string }[],
    bodyImageUrl: string
}) {
    let generatedImageUrl = null;
    let generationError = null;

    try {
        // Helper to fetch image as base64 with resizing
        const fetchImageAsBase64 = async (url: string) => {
            let buffer: Buffer;

            if (url.startsWith("/")) {
                // Handle local files in public folder
                const filePath = path.join(process.cwd(), "public", url);
                buffer = await fs.readFile(filePath);
            } else {
                // Handle remote URLs
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
                const arrayBuffer = await res.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);
            }

            // Resize image using sharp to reduce payload size
            // Max width 512px (faster processing), convert to JPEG with 80% quality
            const resizedBuffer = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 })
                .toBuffer();

            return resizedBuffer.toString("base64");
        };

        const userPhotoBase64 = await fetchImageAsBase64(data.bodyImageUrl);
        // Limit to top 10 items (relying on sharp resizing to keep payload low)
        const limitedItems = data.items.slice(0, 10);

        const itemImagesBase64 = await Promise.all(
            limitedItems.map(async (item) => {
                try {
                    return await fetchImageAsBase64(item.imageUrl);
                } catch (e) {
                    console.error(`Failed to load image for item ${item.id}:`, e);
                    return null;
                }
            })
        );

        // Filter out failed image loads
        const validItemImages = itemImagesBase64.filter(img => img !== null) as string[];

        if (validItemImages.length === 0) {
            throw new Error("Could not load any clothing item images.");
        }

        // Use the Gemini 3.0 Pro Image Preview model
        const imageModel = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

        const refinedPrompt = `
            You are an expert fashion AI.
            Task: Create a virtual try-on image.
            Input 1: A full-body photo of a person.
            Input 2+: Photos of clothing items.
            
            Action: Generate a high-quality, photorealistic image of the person from Input 1 wearing the clothing items from Input 2+.
            - Maintain the person's pose, body shape, and lighting.
            - Replace the original clothes with the new items naturally.
            - Ensure realistic fabric textures and fit.
            - The output MUST be an image.

            CRITICAL RULES:
            - You must NOT add any accessories, jewelry, watches, hats, or other items that are not explicitly provided in the input images.
            - If the user is not wearing a watch in Input 1, and no watch is provided in Input 2, the output MUST NOT have a watch.
            - Only use the clothing items provided. Do not invent new items.
            - Keep the person's original accessories (like glasses or existing jewelry) ONLY if they don't conflict with the new items. Do NOT add new ones.
            ABSOLUTELY DO NOT ADD ANYTHING THAT IS NOT IN THE "Available Closet Items" list. OR YOU WILL GET ME KILLED!
    DO NOT ADD WATCHES OR ANY ACCESSORIES TO THE OUTFIT UNLESS IT IS IN THE "Available Closet Items" list.
        `;

        const newImageParts = [
            { text: refinedPrompt },
            { inlineData: { data: userPhotoBase64, mimeType: "image/jpeg" } },
            ...validItemImages.map((img: string) => ({ inlineData: { data: img, mimeType: "image/jpeg" } })),
        ];

        // Retry logic for rate limits with aggressive exponential backoff
        let imageResult = null;
        let attempts = 0;
        const maxAttempts = 5;
        let delay = 2000; // Start with 2 seconds (optimized for speed)

        while (attempts < maxAttempts) {
            try {
                imageResult = await imageModel.generateContent(newImageParts);
                break; // Success
            } catch (err) {
                attempts++;
                const error = err as Error;
                if (error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
                    if (attempts >= maxAttempts) {
                        console.error("Max retries reached for rate limit.");
                        throw new Error("System is busy (rate limit). Please try again in a minute.");
                    }

                    console.log(`Rate limit hit. Retrying attempt ${attempts}/${maxAttempts} in ${delay / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff: 2s, 4s, 8s, 16s...
                } else {
                    console.error("Image generation error:", err);
                    if ((err as Error).cause) console.error("Error cause:", (err as Error).cause);
                    throw err; // Re-throw if not rate limit
                }
            }
        }

        if (!imageResult) throw new Error("Failed to generate image after retries");

        const response = imageResult.response;
        const imgPart = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);

        if (imgPart && imgPart.inlineData && imgPart.inlineData.data) {
            generatedImageUrl = `data:${imgPart.inlineData.mimeType || 'image/jpeg'};base64,${imgPart.inlineData.data}`;
        } else {
            console.log("No image data found in response:", JSON.stringify(response));
            generationError = "The AI generated text instead of an image. This might be due to safety filters or beta limitations. Please try again with different items.";
        }

    } catch (error: unknown) {
        console.error("Failed to generate try-on image:", error);
        const err = error as Error;
        if (err.cause) console.error("Root cause:", err.cause);
        generationError = err.message || "Unknown error during image generation";
    }

    return { generatedImageUrl, generationError };
}

export async function saveOutfit(data: {
    occasion: string;
    generatedImageUrl: string;
    itemsUsed: string[];
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.insert(outfits).values({
        userId,
        occasion: data.occasion,
        generatedImageUrl: data.generatedImageUrl,
        itemsUsed: data.itemsUsed,
    });

    // Increment usage counter after successful generation
    const { incrementGenerations } = await import("./actions/user-actions");
    await incrementGenerations();

    revalidatePath("/dashboard/generator");
}

export async function getOutfits() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userOutfits = await db.query.outfits.findMany({
        where: eq(outfits.userId, userId),
        orderBy: (outfits, { desc }) => [desc(outfits.createdAt)],
    });

    return userOutfits;
}

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteClothingItem(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const item = await db.query.clothingItems.findFirst({
        where: and(eq(clothingItems.id, id), eq(clothingItems.userId, userId)),
    });

    if (!item) return;

    if (item.imageUrl.includes("utfs.io")) {
        const key = item.imageUrl.split("/").pop();
        if (key) await utapi.deleteFiles(key);
    }

    await db.delete(clothingItems).where(and(eq(clothingItems.id, id), eq(clothingItems.userId, userId)));
    revalidatePath("/dashboard");
}

export async function deleteOutfit(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Outfits currently use base64, but if we switch to hosted images later, this will handle it
    const outfit = await db.query.outfits.findFirst({
        where: and(eq(outfits.id, id), eq(outfits.userId, userId)),
    });

    if (outfit && outfit.generatedImageUrl.includes("utfs.io")) {
        const key = outfit.generatedImageUrl.split("/").pop();
        if (key) await utapi.deleteFiles(key);
    }

    await db.delete(outfits).where(and(eq(outfits.id, id), eq(outfits.userId, userId)));
    revalidatePath("/dashboard/generator");
}
