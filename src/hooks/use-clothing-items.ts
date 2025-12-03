import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClothingItems, deleteClothingItem } from "@/app/actions";
import { toast } from "sonner";
import type { ClothingItem } from "@/types";

export function useClothingItems() {
    return useQuery({
        queryKey: ["clothingItems"],
        queryFn: getClothingItems,
    });
}

export function useDeleteClothingItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteClothingItem,
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["clothingItems"] });

            // Snapshot previous value
            const previousItems = queryClient.getQueryData(["clothingItems"]);

            // Optimistically update
            queryClient.setQueryData(["clothingItems"], (old: ClothingItem[] | undefined) =>
                old?.filter((item) => item.id !== id)
            );

            return { previousItems };
        },
        onError: (error: Error, _id, context) => {
            // Rollback on error
            queryClient.setQueryData(["clothingItems"], context?.previousItems);
            toast.error(error.message || "Failed to delete item");
        },
        onSuccess: () => {
            toast.success("Item deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["clothingItems"] });
        },
    });
}
