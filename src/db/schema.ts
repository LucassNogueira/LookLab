import { pgTable, text, timestamp, uuid, pgEnum, index, integer } from "drizzle-orm/pg-core";
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

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "basic", "pro"]);

// Users table - stores user metadata and subscription info
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").notNull(),
    role: roleEnum("role").default("user").notNull(),
    subscriptionTier: subscriptionTierEnum("subscription_tier").default("free").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        clerkUserIdIdx: index("users_clerk_user_id_idx").on(table.clerkUserId),
    };
});

// Usage tracking table - tracks monthly generation usage
export const usageTracking = pgTable("usage_tracking", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    month: text("month").notNull(), // Format: YYYY-MM
    generationsUsed: integer("generations_used").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        userIdIdx: index("usage_tracking_user_id_idx").on(table.userId),
        monthIdx: index("usage_tracking_month_idx").on(table.month),
    };
});

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
