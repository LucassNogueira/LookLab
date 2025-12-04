"use client";

import React, { useState } from "react";

// Libraries
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Shirt, Sparkles, LayoutGrid, Calculator, Crown, BarChart3, Palette, PanelLeftClose, PanelLeftOpen } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { Role } from "@/types";

export function DashboardNav({ userImage, userRole, showAnalytics }: { userImage?: string | null; userRole?: Role; showAnalytics?: boolean }) {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "Home",
            mobileLabel: "Home",
            icon: LayoutGrid,
            exact: true
        },
        {
            href: "/dashboard/closet",
            label: "Closet",
            mobileLabel: "Closet",
            icon: Shirt,
            exact: true
        },
        {
            href: "/dashboard/generator",
            label: "AI Stylist",
            mobileLabel: "AI",
            icon: Sparkles
        },

        {
            href: "/dashboard/subscription",
            label: "Subscription",
            mobileLabel: "Plan",
            icon: Crown
        },
        {
            href: "/dashboard/analytics",
            label: "Analytics",
            mobileLabel: "Stats",
            icon: BarChart3,
            featureFlag: "showAnalytics"
        },
        {
            href: "/dashboard/admin",
            label: "Admin",
            mobileLabel: "Admin",
            icon: Calculator,
            adminOnly: true
        }
    ];

    const filteredLinks = links.filter(link => {
        if (link.adminOnly && userRole !== "admin") return false;
        if (link.featureFlag === "showAnalytics" && !showAnalytics) return false;
        return true;
    });

    const isActive = (path: string, exact = false) => {
        if (exact) return pathname === path;
        return pathname.startsWith(path);
    };

    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Sidebar (Desktop) */}
            <aside
                className={cn(
                    "border-r border-border hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out bg-background z-20",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className={cn("flex items-center p-6", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 whitespace-nowrap">
                            LookLab
                        </span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md hover:bg-secondary/80 text-muted-foreground transition-colors"
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex flex-col gap-2 px-3">
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium min-h-[40px]",
                                isActive(link.href, link.exact)
                                    ? "bg-secondary/50 text-foreground"
                                    : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? link.label : undefined}
                        >
                            <link.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{link.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-border p-4">
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                        <UserButton />
                        {!isCollapsed && (
                            <Link href="/dashboard/account" className="flex flex-col hover:opacity-80 transition-opacity overflow-hidden">
                                <span className="text-sm font-medium truncate">My Account</span>
                                <span className="text-xs text-muted-foreground truncate">Manage settings</span>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        LookLab
                    </span>
                </div>
                <UserButton />
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-lg border-t border-border flex justify-around p-4 z-50">
                {filteredLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center gap-1 text-xs transition-colors",
                            isActive(link.href, link.exact)
                                ? "text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.mobileLabel || link.label}
                    </Link>
                ))}
            </nav>
        </>
    );
}
