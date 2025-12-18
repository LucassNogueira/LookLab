import React from "react";

// Libraries
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Shirt, Sparkles, Upload, ArrowRight } from "lucide-react";

// Utils
import { getClothingItems, getOutfits } from "@/app/actions";
import { getOrCreateUser } from "@/app/actions/user-actions";

export default async function DashboardPage() {
    const user = await getOrCreateUser();
    const clerkUser = await currentUser();
    const items = await getClothingItems();
    const outfits = await getOutfits();

    const displayName = clerkUser?.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : user.email.split('@')[0];

    const stats = [
        { label: "Total Items", value: items.length, icon: Shirt, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Outfits Created", value: outfits.length, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                    Welcome back, <span className="text-primary">{displayName}</span>
                </h1>
                <p className="text-muted-foreground text-lg">Your closet is ready. What&apos;s the vibe today?</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/generator" className="group p-6 rounded-2xl bg-primary/10 border border-primary/20 hover:border-primary hover:bg-primary/20 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-32 h-32 text-primary" />
                    </div>
                    <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1 uppercase tracking-wide">Generate Outfit</h3>
                    <p className="text-muted-foreground text-sm font-medium">Let AI style you for any occasion</p>
                </Link>

                <Link href="/dashboard/closet?action=add" className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-3 rounded-xl bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Upload className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1 uppercase tracking-wide">Add Clothes</h3>
                    <p className="text-muted-foreground text-sm">Upload new items to your wardrobe</p>
                </Link>

                <Link href="/dashboard/closet" className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-3 rounded-xl bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Shirt className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1 uppercase tracking-wide">View Closet</h3>
                    <p className="text-muted-foreground text-sm">Browse and manage your items</p>
                </Link>
            </div>

            {/* Stats Overview */}
            <div>
                <h2 className="font-display text-2xl font-bold mb-6 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full inline-block" />
                    Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors flex flex-col gap-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-md bg-secondary text-foreground`}>
                                    <stat.icon className={`w-5 h-5`} />
                                </div>
                            </div>

                            <p className="font-display text-4xl font-bold tracking-tighter">{stat.value}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
