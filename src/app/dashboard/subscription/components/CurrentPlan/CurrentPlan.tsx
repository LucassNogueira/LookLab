import React from "react";

// Libraries
import { Crown } from "lucide-react";

interface CurrentPlanProps {
    tierName: string | undefined;
    role: string | undefined;
}

export function CurrentPlan({ tierName, role }: CurrentPlanProps) {
    const isAdmin = role === "admin";

    return (
        <div className="p-6 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 border border-border">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Current Plan</h2>
                    <p className="text-2xl font-bold text-primary mt-2">
                        {tierName}
                    </p>
                    {isAdmin && (
                        <p className="text-sm text-muted-foreground mt-1">
                            You have unlimited access as an admin
                        </p>
                    )}
                </div>
                {isAdmin && <Crown className="w-12 h-12 text-yellow-400" />}
            </div>
        </div>
    );
}
