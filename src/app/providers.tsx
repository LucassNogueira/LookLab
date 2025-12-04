'use client';

import React from "react";

// Libraries
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Utils
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                <NuqsAdapter>
                    {children}
                </NuqsAdapter>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ClerkProvider>
    );
}
