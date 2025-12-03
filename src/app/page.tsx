import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-sm font-medium animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Powered by Nano Banana 3</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Your Closet, <br /> Reimagined.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Digitize your wardrobe and let AI curate the perfect outfit for any occasion.
          See yourself wearing it before you even open your closet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/dashboard"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-white/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center rounded-md px-8 font-medium text-muted-foreground transition-colors hover:text-white"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mock UI Element */}
      <div className="mt-20 w-full max-w-5xl aspect-video rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 p-8 z-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/10" />
            <div>
              <div className="h-4 w-32 bg-gray-800 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-800 rounded" />
            </div>
          </div>
          <p className="text-white/60 text-sm">"Outfit for a summer wedding in Italy..."</p>
        </div>
      </div>
    </main>
  );
}
