import React from "react";

// Libraries
import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto flex flex-col items-center justify-center p-4">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-4xl font-bold tracking-tighter mb-2">
                        <span className="text-primary">Look</span>Lab
                    </h1>
                    <p className="text-muted-foreground">Join the future of fashion.</p>
                </div>
                <SignUp
                    appearance={{
                        elements: {
                            card: "bg-card border border-border shadow-xl rounded-xl",
                            headerTitle: "text-foreground font-display",
                            headerSubtitle: "text-muted-foreground",
                            socialButtonsBlockButton: "bg-secondary text-foreground border-border hover:bg-secondary/80",
                            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                            footerActionLink: "text-primary hover:text-primary/90",
                            formFieldInput: "bg-background border-input text-foreground focus:border-primary",
                            formFieldLabel: "text-foreground",
                        }
                    }}
                />
            </div>
        </div>
    );
}
