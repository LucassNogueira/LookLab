"use client";

import { usePricing, useTokensPerOperation } from "../../atoms";

export function PricingBreakdown() {
    const pricing = usePricing();
    const tokensPerOperation = useTokensPerOperation();

    return (
        <div className="space-y-6">
            {/* Pricing Breakdown */}
            <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                <h3 className="text-xl font-bold mb-4">API Pricing Breakdown</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">gemini-2.0-flash (Input)</span>
                        <span className="font-mono font-medium">${pricing.textInputPer1M}/1M tokens</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">gemini-2.0-flash (Output)</span>
                        <span className="font-mono font-medium">${pricing.textOutputPer1M}/1M tokens</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">gemini-3-pro-image-preview</span>
                        <span className="font-mono font-medium">${pricing.imageGeneration}/image</span>
                    </div>
                </div>
            </div>

            {/* Usage Assumptions */}
            <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                <h3 className="text-xl font-bold mb-4">Calculation Assumptions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Each outfit generation uses ~{tokensPerOperation.outfitGeneration.input.toLocaleString()} input tokens (closet items + prompt)</li>
                    <li>• Each outfit generation produces ~{tokensPerOperation.outfitGeneration.output.toLocaleString()} output tokens (AI reasoning + selection)</li>
                    <li>• Each try-on generates 1 image using gemini-3-pro-image-preview</li>
                    <li>• Pricing based on actual Gemini API rates as of December 2024</li>
                    <li>• Models used: gemini-2.0-flash (text), gemini-3-pro-image-preview (images)</li>
                </ul>
            </div>
        </div>
    );
}

