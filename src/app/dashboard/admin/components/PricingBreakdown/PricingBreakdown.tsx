"use client";

import React from "react";

// Libraries
import { usePricing, useTokensPerOperation } from "../../atoms";

export function PricingBreakdown() {
    const pricing = usePricing();
    const tokensPerOperation = useTokensPerOperation();

    return (
        <div className="space-y-6">
            {/* Pricing Breakdown */}
            <div className="p-8 rounded-2xl bg-card border border-border">
                <h3 className="font-display text-xl font-bold mb-6">API Pricing Breakdown</h3>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-border/50">
                        <span className="text-muted-foreground font-medium">gemini-2.0-flash (Input)</span>
                        <span className="font-mono font-bold text-primary">${pricing.textInputPer1M}/1M tokens</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-border/50">
                        <span className="text-muted-foreground font-medium">gemini-2.0-flash (Output)</span>
                        <span className="font-mono font-bold text-primary">${pricing.textOutputPer1M}/1M tokens</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-border/50">
                        <span className="text-muted-foreground font-medium">gemini-3-pro-image-preview</span>
                        <span className="font-mono font-bold text-primary">${pricing.imageGeneration}/image</span>
                    </div>
                </div>
            </div>

            {/* Usage Assumptions */}
            <div className="p-8 rounded-2xl bg-card border border-border">
                <h3 className="font-display text-xl font-bold mb-6">Calculation Assumptions</h3>
                <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Each outfit generation uses ~{tokensPerOperation.outfitGeneration.input.toLocaleString()} input tokens (closet items + prompt)
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Each outfit generation produces ~{tokensPerOperation.outfitGeneration.output.toLocaleString()} output tokens (AI reasoning + selection)
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Each try-on generates 1 image using gemini-3-pro-image-preview
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Pricing based on actual Gemini API rates as of December 2024
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Models used: gemini-2.0-flash (text), gemini-3-pro-image-preview (images)
                    </li>
                </ul>
            </div>
        </div>
    );
}

