import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionInfo, getUserUsage, checkGenerationLimit } from "@/app/actions/user-actions";
import type { SubscriptionInfo, User, UsageTracking, TierDetails } from "@/types";

export function useSubscriptionInfo() {
    return useQuery<SubscriptionInfo>({
        queryKey: ["subscription-info"],
        queryFn: () => getSubscriptionInfo(),
    });
}

export function useUserUsage() {
    return useQuery<{
        user: User;
        usage: UsageTracking;
        tier: TierDetails;
    }>({
        queryKey: ["user-usage"],
        queryFn: () => getUserUsage(),
    });
}

export function useCheckGenerationLimit() {
    return useQuery({
        queryKey: ["generation-limit"],
        queryFn: () => checkGenerationLimit(),
    });
}
