import { flag } from "@vercel/flags/next";

export const showAnalytics = flag({
    key: "show-analytics",
    decide: async () => {
        // You can implement custom logic here, e.g., check environment variables or user roles
        // For now, we'll default to false until enabled
        return process.env.SHOW_ANALYTICS === "true";
    },
});
