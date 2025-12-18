"use client";

import React, { useEffect } from "react";

// Libraries
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Calculator } from "lucide-react";

// Components
import { UsageStats } from "./components/UsageStats/UsageStats";
import { CostCalculator } from "./components/CostCalculator/CostCalculator";
import { PricingBreakdown } from "./components/PricingBreakdown/PricingBreakdown";
import { UserManagement } from "./components/UserManagement/UserManagement";
import { Scenarios } from "./components/Scenarios/Scenarios";

// Hooks
import { useAllUsers, useUpdateUserRole, useUpdateUserTier } from "./hooks/useAdmin";
import { useSubscriptionInfo } from "@/hooks/use-user";

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    // Data fetching hooks
    const { data: subscriptionInfo, isLoading: isLoadingSubscription } = useSubscriptionInfo();
    const { data: allUsers = [] } = useAllUsers();

    // Mutation hooks
    const updateUserRoleMutation = useUpdateUserRole();
    const updateUserTierMutation = useUpdateUserTier();

    const isAdmin = subscriptionInfo?.role === "admin";

    // Redirect if not logged in or not admin
    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                router.push("/dashboard");
            } else if (subscriptionInfo && subscriptionInfo.role !== "admin") {
                router.push("/dashboard");
            }
        }
    }, [isLoaded, user, subscriptionInfo, router]);

    if (!isLoaded || isLoadingSubscription) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Admin Dashboard Content */}
            {isAdmin && (
                <>
                    <div>
                        <h1 className="font-display text-4xl font-bold flex items-center gap-3 tracking-tight">
                            <Calculator className="w-10 h-10 text-primary fill-primary/20" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Usage analytics and cost calculator for LookLab
                        </p>
                    </div>

                    {/* Current Usage Stats */}
                    <UsageStats />

                    {/* Cost Calculator */}
                    <CostCalculator />

                    {/* Pricing Breakdown */}
                    <PricingBreakdown />

                    {/* User Management */}
                    <UserManagement
                        users={allUsers}
                        onUpdateRole={(data) => updateUserRoleMutation.mutate(data)}
                        onUpdateTier={(data) => updateUserTierMutation.mutate(data)}
                        isUpdatingRole={updateUserRoleMutation.isPending}
                        isUpdatingTier={updateUserTierMutation.isPending}
                    />

                    {/* Scenarios */}
                    <Scenarios />
                </>
            )}
        </div>
    );
}


