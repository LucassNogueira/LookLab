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
        <div className="space-y-8 pb-20">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">
                    Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">{displayName}</span>
                </h1>
                <p className="text-muted-foreground">Here's what's happening in your closet.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/generator" className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Generate Outfit</h3>
                    <p className="text-indigo-100 text-sm">Let AI style you for any occasion</p>
                </Link>

                <Link href="/dashboard/closet?action=add" className="group p-6 rounded-2xl bg-secondary/50 border border-border hover:border-indigo-500/50 hover:bg-secondary transition-all hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-background border border-border">
                            <Upload className="w-6 h-6 text-indigo-500" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Add Clothes</h3>
                    <p className="text-muted-foreground text-sm">Upload new items to your wardrobe</p>
                </Link>

                <Link href="/dashboard/closet" className="group p-6 rounded-2xl bg-secondary/50 border border-border hover:border-purple-500/50 hover:bg-secondary transition-all hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-background border border-border">
                            <Shirt className="w-6 h-6 text-purple-500" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">View Closet</h3>
                    <p className="text-muted-foreground text-sm">Browse and manage your items</p>
                </Link>
            </div>

            {/* Stats Overview */}
            <div>
                <h2 className="text-xl font-bold mb-4">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-4 rounded-xl bg-secondary/20 border border-border flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
