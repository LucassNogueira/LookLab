"use client";

import React from "react";

// Libraries
import { DollarSign, Zap, TrendingUp } from "lucide-react";
import { useCurrentSpend, useEstimatedCurrentImages, useImageGenerationCost } from "../../atoms";

export function UsageStats() {
    const [currentSpend] = useCurrentSpend();
    const estimatedCurrentImages = useEstimatedCurrentImages();
    const imageGenerationCost = useImageGenerationCost();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg shadow-primary/5 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Spend</h3>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <p className="font-display text-4xl font-bold tracking-tight">${currentSpend.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Lifetime API costs</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg shadow-primary/5 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Images</h3>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Zap className="w-5 h-5" />
                    </div>
                </div>
                <p className="font-display text-4xl font-bold tracking-tight">~{estimatedCurrentImages}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Try-on images created</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg shadow-primary/5 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Cost/Image</h3>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
                <p className="font-display text-4xl font-bold tracking-tight">${imageGenerationCost.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Imagen 3 pricing</p>
            </div>
        </div>
    );
}

