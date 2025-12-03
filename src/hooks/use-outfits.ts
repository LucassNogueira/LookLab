import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOutfits, generateOutfit, generateTryOn, saveOutfit, deleteOutfit } from "@/app/actions";
import { toast } from "sonner";
import type { Outfit } from "@/types";

export function useOutfits() {
    return useQuery({
        queryKey: ["outfits"],
        queryFn: getOutfits,
    });
}

export function useGenerateOutfit() {
    return useMutation({
        mutationFn: generateOutfit,
        onError: (error: Error) => {
            toast.error(error.message || "Failed to generate outfit");
        },
    });
}

export function useGenerateTryOn() {
    return useMutation({
        mutationFn: generateTryOn,
        onError: (error: Error) => {
            toast.error(error.message || "Failed to generate try-on");
        },
    });
}

export function useSaveOutfit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveOutfit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outfits"] });
            toast.success("Outfit saved to history!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to save outfit");
        },
    });
}

export function useDeleteOutfit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteOutfit,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["outfits"] });
            const previousOutfits = queryClient.getQueryData(["outfits"]);

            queryClient.setQueryData(["outfits"], (old: Outfit[] | undefined) =>
                old?.filter((outfit) => outfit.id !== id)
            );

            return { previousOutfits };
        },
        onError: (error: Error, _id, context) => {
            queryClient.setQueryData(["outfits"], context?.previousOutfits);
            toast.error(error.message || "Failed to delete");
        },
        onSuccess: () => {
            toast.success("Outfit deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["outfits"] });
        },
    });
}
