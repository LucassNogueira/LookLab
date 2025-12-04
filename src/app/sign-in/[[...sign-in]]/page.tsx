import React from "react";

// Libraries
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn />
        </div>
    );
}
