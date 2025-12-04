"use client";

import React from "react";

// Libraries
import { useCostPerUser } from "../../atoms";

export function Scenarios() {
    const costPerUser = useCostPerUser();

    return (
        <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border">
            <h3 className="text-xl font-bold mb-4">Example Scenarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50 space-y-2">
                    <h4 className="font-semibold text-indigo-400">Small App (100 users)</h4>
                    <p className="text-sm text-muted-foreground">1 generation per day</p>
                    <p className="text-2xl font-bold">${(100 * costPerUser).toFixed(2)}/mo</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 space-y-2">
                    <h4 className="font-semibold text-purple-400">Medium App (1,000 users)</h4>
                    <p className="text-sm text-muted-foreground">1 generation per day</p>
                    <p className="text-2xl font-bold">${(1000 * costPerUser).toFixed(2)}/mo</p>
                </div>
            </div>
        </div>
    );
}

