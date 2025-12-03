import { Shield, Crown } from "lucide-react";
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
        <div className="p-6 rounded-xl bg-secondary/20 border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-400" />
                User Management
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tier</th>
                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-border/50">
                                <td className="p-3 text-sm">{u.email}</td>
                                <td className="p-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-blue-500/20 text-blue-400"
                                        }`}>
                                        {u.role === "admin" && <Crown className="w-3 h-3" />}
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <select
                                        value={u.subscriptionTier}
                                        onChange={(e) => {
                                            onUpdateTier({
                                                userId: u.id,
                                                tier: e.target.value as SubscriptionTier
                                            });
                                        }}
                                        disabled={isUpdatingTier}
                                        className="px-2 py-1 rounded bg-background border border-border text-sm"
                                    >
                                        <option value="free">Free</option>
                                        <option value="basic">Basic</option>
                                        <option value="pro">Pro</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => {
                                            const newRole = u.role === "admin" ? "user" : "admin";
                                            onUpdateRole({
                                                userId: u.id,
                                                role: newRole as Role
                                            });
                                        }}
                                        disabled={isUpdatingRole}
                                        className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs font-medium transition-colors"
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
