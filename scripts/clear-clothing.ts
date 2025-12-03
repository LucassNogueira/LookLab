import "dotenv/config";
import { db } from "@/db";
import { clothingItems } from "@/db/schema";

async function main() {
    console.log("Deleting all clothing items...");
    await db.delete(clothingItems);
    console.log("Done.");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
