import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUserRole, updateUserTier } from "@/app/actions/admin-actions";
import { makeCurrentUserAdmin } from "@/app/actions/setup-admin";
import type { User, Role, SubscriptionTier } from "@/types";
import { toast } from "sonner";

export function useAllUsers() {
    return useQuery<User[]>({
        queryKey: ["all-users"],
        queryFn: () => getAllUsers(),
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
            updateUserRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            toast.success("User role updated");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update role: ${error.message}`);
        },
    });
}

export function useUpdateUserTier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, tier }: { userId: string; tier: SubscriptionTier }) =>
            updateUserTier(userId, tier),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            toast.success("User tier updated");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update tier: ${error.message}`);
        },
    });
}

export function useMakeCurrentUserAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => makeCurrentUserAdmin(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            queryClient.invalidateQueries({ queryKey: ["subscription-info"] });
            toast.success("You are now an admin!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to make admin: ${error.message}`);
        },
    });
}
