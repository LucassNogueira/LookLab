import React from "react";

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
    // Sync user to DB
    const dbUser = await getOrCreateUser();
    const analyticsEnabled = await showAnalytics();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            <DashboardNav userRole={dbUser.role} showAnalytics={analyticsEnabled} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-100 md:pb-8">
                {children}
            </main>
        </div>
    );
}
