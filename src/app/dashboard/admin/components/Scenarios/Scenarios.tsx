"use client";

import React from "react";

// Libraries
import { useCostPerUser } from "../../atoms";

export function Scenarios() {
    const costPerUser = useCostPerUser();

    return (
        <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="font-display text-xl font-bold mb-6">Example Scenarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-colors">
                    <h4 className="font-bold text-primary mb-1">Small App (100 users)</h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">1 generation per day</p>
                    <p className="font-display text-3xl font-bold">${(100 * costPerUser).toFixed(2)}<span className="text-sm font-sans text-muted-foreground font-medium ml-1">/mo</span></p>
                </div>
                <div className="p-6 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-colors">
                    <h4 className="font-bold text-primary mb-1">Medium App (1,000 users)</h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">1 generation per day</p>
                    <p className="font-display text-3xl font-bold">${(1000 * costPerUser).toFixed(2)}<span className="text-sm font-sans text-muted-foreground font-medium ml-1">/mo</span></p>
                </div>
            </div>
        </div>
    );
}

