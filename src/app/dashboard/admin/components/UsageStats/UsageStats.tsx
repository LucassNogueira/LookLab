"use client";

import { DollarSign, Zap, TrendingUp } from "lucide-react";
import { useCurrentSpend, useEstimatedCurrentImages, useImageGenerationCost } from "../../atoms";

export function UsageStats() {
    const [currentSpend] = useCurrentSpend();
    const estimatedCurrentImages = useEstimatedCurrentImages();
    const imageGenerationCost = useImageGenerationCost();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Spend</h3>
                    <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold">${currentSpend.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Lifetime API costs</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-border">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Est. Images Generated</h3>
                    <Zap className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold">~{estimatedCurrentImages}</p>
                <p className="text-xs text-muted-foreground mt-1">Try-on images created</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Avg Cost/Image</h3>
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold">${imageGenerationCost.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground mt-1">Imagen 3 pricing</p>
            </div>
        </div>
    );
}

