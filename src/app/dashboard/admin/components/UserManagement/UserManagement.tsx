import React from "react";

// Libraries
import { Shield, Crown } from "lucide-react";

// Types
import type { User, Role, SubscriptionTier } from "@/types";

interface UserManagementProps {
    users: User[];
    onUpdateRole: (data: { userId: string; role: Role }) => void;
    onUpdateTier: (data: { userId: string; tier: SubscriptionTier }) => void;
    isUpdatingRole: boolean;
    isUpdatingTier: boolean;
}

export function UserManagement({ users, onUpdateRole, onUpdateTier, isUpdatingRole, isUpdatingTier }: UserManagementProps) {
    if (users.length === 0) return null;
    return (
        <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                User Management
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full">
                    <thead className="bg-secondary/30">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                            <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier</th>
                            <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                                <td className="p-4 text-sm font-medium">{u.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === "admin"
                                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        : "bg-primary/10 text-primary border border-primary/20"
                                        }`}>
                                        {u.role === "admin" && <Crown className="w-3 h-3" />}
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={u.subscriptionTier}
                                        onChange={(e) => {
                                            onUpdateTier({
                                                userId: u.id,
                                                tier: e.target.value as SubscriptionTier
                                            });
                                        }}
                                        disabled={isUpdatingTier}
                                        className="px-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    >
                                        <option value="free">Free</option>
                                        <option value="basic">Basic</option>
                                        <option value="pro">Pro</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => {
                                            const newRole = u.role === "admin" ? "user" : "admin";
                                            onUpdateRole({
                                                userId: u.id,
                                                role: newRole as Role
                                            });
                                        }}
                                        disabled={isUpdatingRole}
                                        className="px-3 py-1.5 rounded-lg bg-secondary/30 text-foreground hover:bg-primary hover:text-primary-foreground text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                                    >
                                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
