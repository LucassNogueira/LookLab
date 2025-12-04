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
        <div className="p-8 rounded-xl bg-secondary/20 border border-border space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold">Usage Cost Calculator</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Count */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Users</label>
                    <input
                        type="number"
                        value={userCount}
                        onChange={(e) => setUserCount(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-indigo-500 outline-none"
                        min="1"
                    />
                </div>

                {/* Daily Generations per user */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Daily Generations/User</label>
                    <input
                        type="number"
                        value={dailyGenerationsPerUser}
                        onChange={(e) => setDailyGenerationsPerUser(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-indigo-500 outline-none"
                        min="0"
                        step="0.1"
                    />
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Cost per User/Month</p>
                    <p className="text-2xl font-bold text-indigo-400">${costPerUser.toFixed(4)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Monthly Cost</p>
                    <p className="text-2xl font-bold text-green-400">${totalMonthlyCost.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Annual Cost</p>
                    <p className="text-2xl font-bold text-purple-400">${annualCost.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}

