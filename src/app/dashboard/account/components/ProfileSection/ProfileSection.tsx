import React from "react";

// Libraries
import { User, Mail, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

interface ProfileSectionProps {
    user: any; // Using any to avoid importing specific Clerk types for now
}

export function ProfileSection({ user }: ProfileSectionProps) {
    const { signOut, openUserProfile } = useClerk();

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Profile
                </h2>
                <p className="text-sm text-muted-foreground">
                    Your personal account details managed by Clerk.
                </p>
            </div>

            <div className="md:col-span-2 p-6 rounded-2xl bg-secondary/20 border border-border backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/20">
                            <Image
                                src={user?.imageUrl || ""}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{user?.fullName || "User"}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Mail className="w-3 h-3" />
                                {user?.primaryEmailAddress?.emailAddress}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        onClick={() => openUserProfile()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Manage Account
                    </button>
                    <button
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </section>
    );
}
