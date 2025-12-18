"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Shirt, Camera, Wand2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-tighter">
            <span className="text-primary">Look</span>Lab
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
              Sign In
            </Link>
            <Button asChild className="font-bold uppercase tracking-wide">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] right-[20%] w-[20vw] h-[20vw] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Star className="w-3 h-3 fill-current" />
              <span>The Future of Fashion</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
              WEAR <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-300">
                WHAT MATTERS.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
              Stop guessing. Start styling. Digitize your closet and let AI curate your perfect look for every occasion.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="h-14 px-8 text-base font-bold uppercase tracking-wide rounded-full">
                <Link href="/sign-up">
                  Start Styling Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-bold uppercase tracking-wide rounded-full border-2 hover:bg-secondary/50">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual / Interface Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="relative rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl p-6 shadow-2xl">
              {/* Mock UI Card */}
              <div className="aspect-4/5 md:aspect-square relative overflow-hidden rounded-2xl bg-secondary/30 flex items-center justify-center border border-white/5">
                <Wand2 className="w-24 h-24 text-primary opacity-50" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-background/80 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold uppercase text-muted-foreground">AI Suggestion</span>
                  </div>
                  <p className="font-display font-medium text-lg">&quot;Perfect for a rainy coffee date.&quot;</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-32 bg-secondary/10 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Simple Plans. <span className="text-primary">Radical Style.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Unlock the full potential of your wardrobe with our flexible pricing tiers.
            </p>
            <Button asChild size="lg" className="h-14 px-10 text-base font-bold uppercase tracking-wide rounded-full">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shirt, title: "Digitize", desc: "Snap a photo. We remove the background and tag it automatically." },
              { icon: Wand2, title: "Generate", desc: "Our AI creates outfits based on weather, occasion, and your taste." },
              { icon: Camera, title: "Visualize", desc: "See it on you before you wear it. Virtual try-on simplified." }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-secondary/20 border border-white/5 hover:border-primary/50 transition-colors duration-500">
                <item.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="font-display text-2xl font-bold mb-4 uppercase">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-background text-center">
        <div className="container mx-auto px-6">
          <div className="font-display font-bold text-2xl tracking-tighter mb-4 opacity-50">
            <span className="text-primary">Look</span>Lab
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LookLab. Designed for the bold.
          </p>
        </div>
      </footer>
    </main>
  );
}
