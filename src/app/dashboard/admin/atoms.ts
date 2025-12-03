import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// Base Atoms
const userCountAtom = atom(100);
const dailyGenerationsAtom = atom(1);
const currentSpendAtom = atom(0.56);

// Constants for Pricing (moved from page.tsx to here or just used in derived atoms)
const PRICING = {
    textInputPer1M: 0.10,
    textOutputPer1M: 0.40,
    imageGeneration: 0.134,
};

const TOKENS_PER_OPERATION = {
    outfitGeneration: {
        input: 2000,
        output: 500,
    },
};

// Derived Atoms
const costPerUserAtom = atom((get) => {
    const dailyGenerations = get(dailyGenerationsAtom);
    const generationsPerMonth = dailyGenerations * 30;

    const outfitInputTokens = generationsPerMonth * TOKENS_PER_OPERATION.outfitGeneration.input;
    const outfitOutputTokens = generationsPerMonth * TOKENS_PER_OPERATION.outfitGeneration.output;

    const textCost =
        (outfitInputTokens / 1_000_000) * PRICING.textInputPer1M +
        (outfitOutputTokens / 1_000_000) * PRICING.textOutputPer1M;

    const imageCost = generationsPerMonth * PRICING.imageGeneration;

    return textCost + imageCost;
});

const totalMonthlyCostAtom = atom((get) => {
    return get(costPerUserAtom) * get(userCountAtom);
});

const annualCostAtom = atom((get) => {
    return get(totalMonthlyCostAtom) * 12;
});

const estimatedCurrentImagesAtom = atom((get) => {
    return Math.round(get(currentSpendAtom) / PRICING.imageGeneration);
});

// Custom Hooks
export const useUserCount = () => useAtom(userCountAtom);
export const useDailyGenerations = () => useAtom(dailyGenerationsAtom);
export const useCurrentSpend = () => useAtom(currentSpendAtom);

// Read-only hooks
export const useCostPerUser = () => useAtomValue(costPerUserAtom);
export const useTotalMonthlyCost = () => useAtomValue(totalMonthlyCostAtom);
export const useAnnualCost = () => useAtomValue(annualCostAtom);
export const useEstimatedCurrentImages = () => useAtomValue(estimatedCurrentImagesAtom);
export const useImageGenerationCost = () => PRICING.imageGeneration;
export const usePricing = () => PRICING;
export const useTokensPerOperation = () => TOKENS_PER_OPERATION;
