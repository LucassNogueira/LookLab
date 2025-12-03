"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// Make current user an admin (only works if no admins exist yet, or user is already admin)
export async function makeCurrentUserAdmin() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user exists
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, userId))
        .limit(1);

    if (existingUser.length === 0) {
        throw new Error("User not found. Please visit the generator page first to create your account.");
    }

    // Check if any admins exist
    const existingAdmins = await db
        .select()
        .from(users)
        .where(eq(users.role, "admin"));

    // Only allow if no admins exist, or if user is already an admin
    if (existingAdmins.length > 0 && existingUser[0].role !== "admin") {
        throw new Error("An admin already exists. Contact them to grant you admin access.");
    }

    // Make user admin
    await db
        .update(users)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(users.id, existingUser[0].id));

    return { success: true };
}
