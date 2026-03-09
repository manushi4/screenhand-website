"use client";

import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import LiveDemo from "@/components/LiveDemo";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import Comparison from "@/components/Comparison";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const CursorGlow = dynamic(() => import("@/components/CursorGlow"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <LiveDemo />
        <Features />
        <SocialProof />
        <Comparison />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
