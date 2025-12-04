import React from "react";

// Libraries
import Link from "next/link";
import { ArrowRight, Sparkles, Shirt, Camera, Wand2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              LookLab
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-48 md:pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Your AI Personal Stylist</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
            Your Closet, <br /> Reimagined.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Digitize your wardrobe, generate stunning outfits with AI, and visualize them on your own body before you even open your closet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/dashboard"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <span className="mr-2">Start Styling</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to look your best</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LookLab combines advanced AI with intuitive design to revolutionize how you manage your style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shirt,
                title: "Digital Wardrobe",
                description: "Upload photos of your clothes to create a searchable, organized digital closet accessible from anywhere."
              },
              {
                icon: Wand2,
                title: "AI Outfit Generator",
                description: "Get personalized outfit recommendations for any occasion based on your style and weather."
              },
              {
                icon: Camera,
                title: "Virtual Try-On",
                description: "See how outfits look on your actual body using our advanced AI visualization technology."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-background/50 border border-white/5 hover:border-purple-500/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-to-b from-indigo-900/20 to-purple-900/20 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-10" />

          <h2 className="text-3xl md:text-4xl font-bold">Ready to upgrade your style?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are saving time and dressing better with LookLab.
          </p>

          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-white/90 hover:scale-105"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} LookLab. All rights reserved.</p>
      </footer>
    </main>
  );
}
