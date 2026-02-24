"use client";

import React from "react";

// Libraries
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

// Components
import { ProfileSection } from "./components/ProfileSection/ProfileSection";
import { BodyProfilesSection } from "./components/BodyProfilesSection/BodyProfilesSection";

export default function AccountPage() {
    const { user, isLoaded: isUserLoaded } = useUser();

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 inline-block">
                    Account Settings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your personal information and body profiles
                </p>
            </div>

            {/* Account Details Section */}
            <ProfileSection user={user} />

            <div className="h-px bg-border/50" />

            {/* Body Profiles Section */}
            <BodyProfilesSection />
        </div>
    );
}

