"use client";

import React from "react";

// Libraries
import { TrendingUp } from "lucide-react";

interface UsageIndicatorProps {
    used: number;
    limit: number | typeof Infinity;
    tier: string;
}

export function UsageIndicator({ used, limit, tier }: UsageIndicatorProps) {
    const isUnlimited = limit === Infinity;
    const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
    const remaining = isUnlimited ? Infinity : Math.max(0, limit - used);

    const getColor = () => {
        if (isUnlimited) return "bg-linear-to-r from-primary/80 to-primary";
        if (percentage >= 90) return "bg-red-500";
        if (percentage >= 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="p-4 rounded-xl bg-secondary/20">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Monthly Usage</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{tier} Plan</span>
            </div>

            {isUnlimited ? (
                <div className="space-y-2">
                    <div className="h-2 rounded-full bg-linear-to-r from-primary/80 to-primary animate-pulse" />
                    <p className="text-sm font-medium">Unlimited Generations</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${getColor()}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                            {used} of {limit} used
                        </span>
                        <span className="text-muted-foreground">
                            {remaining} remaining
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
