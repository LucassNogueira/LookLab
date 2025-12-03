import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBodyProfiles, deleteBodyProfile, saveBodyProfile } from "@/app/actions";
import { toast } from "sonner";

export function useBodyProfiles() {
    return useQuery({
        queryKey: ["bodyProfiles"],
        queryFn: getBodyProfiles,
    });
}

export function useSaveBodyProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveBodyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodyProfiles"] });
            toast.success("Profile photo added!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to save profile");
        },
    });
}

export function useDeleteBodyProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBodyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodyProfiles"] });
            toast.success("Profile deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete profile");
        },
    });
}
