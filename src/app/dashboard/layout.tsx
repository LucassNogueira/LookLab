import React from "react";

// Libraries
import { currentUser } from "@clerk/nextjs/server";

// Components
import { DashboardNav } from "./components/dashboard-nav";

// Utils
import { getOrCreateUser } from "@/app/actions/user-actions";
import { showAnalytics } from "@/flags";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    // Sync user to DB
    const dbUser = await getOrCreateUser();
    const analyticsEnabled = await showAnalytics();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            <DashboardNav userImage={user?.imageUrl} userRole={dbUser.role} showAnalytics={analyticsEnabled} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-[25rem] md:pb-8">
                {children}
            </main>
        </div>
    );
}
