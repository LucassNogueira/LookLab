"use server";

import { db } from "@/db";
import { users, usageTracking } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { SUBSCRIPTION_TIERS, type SubscriptionTier, canGenerate, getRemainingGenerations } from "@/lib/subscription-tiers";

// Get or create user in our database
export async function getOrCreateUser() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not found");

    // Check if user exists in our database
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1);

    if (existingUser.length > 0) {
        return existingUser[0];
    }

    // Create new user
    const newUser = await db
        .insert(users)
        .values({
            clerkUserId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            role: "user",
            subscriptionTier: "free",
        })
        .returning();

    return newUser[0];
}

// Get current month's usage for a user
export async function getUserUsage() {
    const user = await getOrCreateUser();
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const usage = await db
        .select()
        .from(usageTracking)
        .where(
            and(
                eq(usageTracking.userId, user.id),
                eq(usageTracking.month, currentMonth)
            )
        )
        .limit(1);

    if (usage.length === 0) {
        // Create usage record for this month
        const newUsage = await db
            .insert(usageTracking)
            .values({
                userId: user.id,
                month: currentMonth,
                generationsUsed: 0,
            })
            .returning();

        return {
            user,
            usage: newUsage[0],
            tier: SUBSCRIPTION_TIERS[user.subscriptionTier as SubscriptionTier],
        };
    }

    return {
        user,
        usage: usage[0],
        tier: SUBSCRIPTION_TIERS[user.subscriptionTier as SubscriptionTier],
    };
}

// Check if user can generate an outfit
export async function checkGenerationLimit(): Promise<{
    canGenerate: boolean;
    remaining: number;
    tier: string;
}> {
    const { user, usage, tier } = await getUserUsage();

    const tierKey = user.role === "admin" ? "admin" : (user.subscriptionTier as SubscriptionTier);
    const allowed = canGenerate(tierKey, usage.generationsUsed);
    const remaining = getRemainingGenerations(tierKey, usage.generationsUsed);

    return {
        canGenerate: allowed,
        remaining,
        tier: tier.name,
    };
}

// Increment generation counter
export async function incrementGenerations() {
    const { user, usage } = await getUserUsage();
    const currentMonth = new Date().toISOString().slice(0, 7);

    await db
        .update(usageTracking)
        .set({
            generationsUsed: usage.generationsUsed + 1,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(usageTracking.userId, user.id),
                eq(usageTracking.month, currentMonth)
            )
        );
}

// Get user's subscription info
export async function getSubscriptionInfo() {
    const { user, usage, tier } = await getUserUsage();

    return {
        tier: user.role === "admin" ? "admin" : user.subscriptionTier,
        tierName: user.role === "admin" ? "Admin" : tier.name,
        generationsUsed: usage.generationsUsed,
        generationsLimit: user.role === "admin" ? Infinity : tier.generationsPerMonth,
        remaining: user.role === "admin" ? Infinity : tier.generationsPerMonth - usage.generationsUsed,
        role: user.role,
    };
}
