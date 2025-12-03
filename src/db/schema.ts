import { pgTable, text, timestamp, uuid, pgEnum, index } from "drizzle-orm/pg-core";
import { ALL_SUBCATEGORIES } from "@/lib/clothing-constants";

export const categoryEnum = pgEnum("category", [
    "top",
    "bottom",
    "shoes",
    "accessory",
    "outerwear",
]);

// Create the subcategory enum from our constants
// We cast to [string, ...string[]] to satisfy Drizzle's type requirement for at least one value
export const subCategoryEnum = pgEnum("sub_category_enum", ALL_SUBCATEGORIES as [string, ...string[]]);

export const clothingItems = pgTable("clothing_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(), // Clerk User ID
    imageUrl: text("image_url").notNull(),
    category: categoryEnum("category").notNull(),
    subCategory: subCategoryEnum("sub_category"), // Now using the enum
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        userIdIdx: index("clothing_items_user_id_idx").on(table.userId),
    };
});

export const bodyProfiles = pgTable("body_profiles", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(), // Clerk User ID
    imageUrl: text("image_url").notNull(),
    name: text("name").default("My Profile"),
    isDefault: text("is_default").default("false"), // "true" or "false" (using text for simplicity or boolean if supported)
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        userIdIdx: index("body_profiles_user_id_idx").on(table.userId),
    };
});

export const outfits = pgTable("outfits", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(), // Clerk User ID
    occasion: text("occasion").notNull(),
    generatedImageUrl: text("generated_image_url").notNull(),
    itemsUsed: uuid("items_used").array(), // Array of clothing_item IDs
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        userIdIdx: index("outfits_user_id_idx").on(table.userId),
    };
});
