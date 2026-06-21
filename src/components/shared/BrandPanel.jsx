"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote: "CoachingHunt made it so easy to find and book a demo. I found the perfect JEE batch in days!",
    author: "Rohan Verma",
    role: "JEE Aspirant, Indore"
  },
  {
    quote: "Listing our coaching here helped us connect with local students. The booking system works like a charm.",
    author: "Dr. K. S. Sen",
    role: "Director, Sen Academy"
  },
  {
    quote: "Comparing fees and reviews in one place saved weeks of visiting centers in the heat.",
    author: "Aditi Sharma",
    role: "Class 12 Student, Bhopal"
  }
];

export function BrandPanel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white md:flex lg:p-16">
      {/* Mesh Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(44,76,156,0.3)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.25)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[30%] left-[40%] h-[40%] w-[40%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_60%)] blur-2xl" />
      </div>

      {/* SVG Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0H0v30' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px"
        }}
      />

      {/* Header */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-90">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white shadow-lg shadow-indigo-600/30">
            C
          </span>
          <span>
            Coaching<span className="text-indigo-400">Hunt</span>
          </span>
        </Link>
      </div>

      {/* Mock Visuals Showcase */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-6 py-8">
        
        {/* Floating Card 1: Verified Institute */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Verified Partner
            </span>
            <div className="flex items-center gap-0.5 text-amber-400 text-sm font-semibold">
              ★ 4.9 <span className="text-xs text-white/40 font-normal">(140+ reviews)</span>
            </div>
          </div>
          
          <h3 className="mt-3 text-lg font-bold text-white">Apex IIT-JEE Academy</h3>
          <p className="text-xs text-white/60">Indore, Madhya Pradesh</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-white/80 border border-white/5">IIT-JEE</span>
            <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-white/80 border border-white/5">Foundation (9-12)</span>
            <span className="rounded-md bg-indigo-500/20 px-2 py-1 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">Demo Slots Open</span>
          </div>
        </motion.div>

        {/* Floating Card 2: Interactive Stats & Demo Alerts */}
        <div className="flex w-full max-w-sm gap-4">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center shadow-xl backdrop-blur-md"
          >
            <div className="text-2xl font-black text-indigo-400">10,000+</div>
            <div className="mt-1 text-[10px] font-medium text-white/50 uppercase tracking-wider">Students Guided</div>
          </motion.div>

          {/* Booking Alert Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                ⚡
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">New Demo Booked</div>
                <div className="text-[9px] text-white/50">Physics Class • 2m ago</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Footer Area with Testimonials */}
      <div className="relative z-10 mt-auto border-t border-white/10 pt-6">
        <div className="min-h-[90px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium italic leading-relaxed text-white/90">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{testimonials[current].author}</h4>
                  <p className="text-[10px] text-white/50">{testimonials[current].role}</p>
                </div>
                {/* Dots indicator */}
                <div className="flex gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        idx === current ? "w-4 bg-indigo-500" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-8 text-[11px] text-white/40">
          © {new Date().getFullYear()} CoachingHunt. All rights reserved.
        </p>
      </div>
    </div>
  );
}
