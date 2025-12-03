export type Role = "admin" | "user";
export type SubscriptionTier = "free" | "basic" | "pro";
export type Category = "top" | "bottom" | "shoes" | "accessory" | "outerwear";

export interface User {
    id: string;
    clerkUserId: string;
    email: string;
    role: Role;
    subscriptionTier: SubscriptionTier;
    createdAt: Date;
    updatedAt: Date;
}

export interface UsageTracking {
    id: string;
    userId: string;
    month: string;
    generationsUsed: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClothingItem {
    id: string;
    userId: string;
    imageUrl: string;
    category: Category;
    subCategory: string | null;
    description: string | null;
    createdAt: Date;
}

export interface BodyProfile {
    id: string;
    userId: string;
    imageUrl: string;
    name: string | null;
    isDefault: string | null; // "true" | "false"
    createdAt: Date;
}

export interface Outfit {
    id: string;
    userId: string;
    occasion: string;
    generatedImageUrl: string;
    itemsUsed: string[] | null;
    createdAt: Date;
}

export interface SubscriptionInfo {
    tier: SubscriptionTier | "admin";
    tierName: string;
    generationsUsed: number;
    generationsLimit: number;
    remaining: number;
    role: Role;
}

export interface TierDetails {
    name: string;
    price: number;
    generationsPerMonth: number;
    description: string;
    features: readonly string[];
}

export interface GenerationResult {
    selection: {
        reasoning: string;
        selectedItemIds: string[];
    };
    closetItems: ClothingItem[];
}
