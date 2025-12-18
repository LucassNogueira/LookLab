"use client";

import React, { useState } from "react";

// Libraries
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Shirt, Sparkles, LayoutGrid, Calculator, Crown, BarChart3, PanelLeftClose, PanelLeftOpen } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { Role } from "@/types";

export function DashboardNav({ userRole, showAnalytics }: { userRole?: Role; showAnalytics?: boolean }) {
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
                    "border-r border-border hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out bg-card z-20 shadow-xl",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className={cn("flex items-center p-6 h-20 border-b border-border/50", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <span className="font-display font-bold text-2xl tracking-tighter">
                            <span className="text-primary">Look</span>Lab
                        </span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors group"
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5 group-hover:text-primary" /> : <PanelLeftClose className="w-5 h-5 group-hover:text-primary" />}
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-3 mt-4">
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium min-h-[44px] group relative overflow-hidden",
                                isActive(link.href, link.exact)
                                    ? "bg-secondary text-primary font-bold shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? link.label : undefined}
                        >
                            {isActive(link.href, link.exact) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}
                            <link.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive(link.href, link.exact) ? "text-primary" : "group-hover:text-primary")} />
                            {!isCollapsed && <span>{link.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-border/50 p-4 bg-muted/20">
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border-2 border-primary/20 hover:border-primary transition-colors"
                                }
                            }}
                        />
                        {!isCollapsed && (
                            <Link href="/dashboard/account" className="flex flex-col hover:opacity-80 transition-opacity overflow-hidden group">
                                <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">My Account</span>
                                <span className="text-xs text-muted-foreground truncate">Manage settings</span>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-40 shadow-md">
                <div className="flex items-center gap-2 font-display font-bold text-lg">
                    <span className="text-primary">Look</span>Lab
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
