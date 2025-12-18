"use client";

import React from "react";

// Libraries
import { Users } from "lucide-react";
import {

    useUserCount,
    useDailyGenerations,
    useCostPerUser,
    useTotalMonthlyCost,
    useAnnualCost
} from "../../atoms";

export function CostCalculator() {
    const [userCount, setUserCount] = useUserCount();
    const [dailyGenerationsPerUser, setDailyGenerationsPerUser] = useDailyGenerations();
    const costPerUser = useCostPerUser();
    const totalMonthlyCost = useTotalMonthlyCost();
    const annualCost = useAnnualCost();

    return (
        <div className="p-8 rounded-2xl bg-card border border-border space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Usage Cost Calculator</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Count */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Number of Users</label>
                    <input
                        type="number"
                        value={userCount}
                        onChange={(e) => setUserCount(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                        min="1"
                    />
                </div>

                {/* Daily Generations per user */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daily Generations/User</label>
                    <input
                        type="number"
                        value={dailyGenerationsPerUser}
                        onChange={(e) => setDailyGenerationsPerUser(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                        min="0"
                        step="0.1"
                    />
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="p-5 rounded-xl bg-secondary/20 border border-border/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Cost per User/Month</p>
                    <p className="font-display text-3xl font-bold text-primary">${costPerUser.toFixed(4)}</p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/20 border border-border/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Total Monthly Cost</p>
                    <p className="font-display text-3xl font-bold text-primary">${totalMonthlyCost.toFixed(2)}</p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/20 border border-border/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Annual Cost</p>
                    <p className="font-display text-3xl font-bold text-primary">${annualCost.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}

