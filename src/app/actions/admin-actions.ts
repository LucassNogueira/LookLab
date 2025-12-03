"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all users (admin only)
export async function getAllUsers() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user is admin
    const currentUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, userId))
        .limit(1);

    if (currentUser.length === 0 || currentUser[0].role !== "admin") {
        throw new Error("Admin access required");
    }

    const allUsers = await db.select().from(users);
    return allUsers;
}

// Update user role (admin only)
export async function updateUserRole(targetUserId: string, newRole: "admin" | "user") {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if current user is admin
    const currentUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, userId))
        .limit(1);

    if (currentUser.length === 0 || currentUser[0].role !== "admin") {
        throw new Error("Admin access required");
    }

    await db
        .update(users)
        .set({ role: newRole, updatedAt: new Date() })
        .where(eq(users.id, targetUserId));

    revalidatePath("/dashboard/admin");
}

// Update user subscription tier (admin only)
export async function updateUserTier(
    targetUserId: string,
    newTier: "free" | "basic" | "pro"
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if current user is admin
    const currentUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, userId))
        .limit(1);

    if (currentUser.length === 0 || currentUser[0].role !== "admin") {
        throw new Error("Admin access required");
    }

    await db
        .update(users)
        .set({ subscriptionTier: newTier, updatedAt: new Date() })
        .where(eq(users.id, targetUserId));

    revalidatePath("/dashboard/admin");
}
