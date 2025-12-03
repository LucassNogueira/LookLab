import { atom, useAtom } from 'jotai';
import type { ClothingItem } from '@/types';

export type OutfitSlots = {
    outerwear: ClothingItem | null;
    top: ClothingItem | null;
    bottom: ClothingItem | null;
    shoes: ClothingItem | null;
    accessory: ClothingItem | null;
};

// Atoms
const outfitSlotsAtom = atom<OutfitSlots>({
    outerwear: null,
    top: null,
    bottom: null,
    shoes: null,
    accessory: null,
});

// Hooks
export const useOutfitSlots = () => useAtom(outfitSlotsAtom);
