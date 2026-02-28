import * as React from "react";
import type { HeadFC } from "gatsby";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";
import { PERSONAL } from "../data/portfolio";

/* ============================================
   Home Page — compose all sections
   ============================================ */

const IndexPage: React.FC = () => {
  /* --- Scroll reveal (IntersectionObserver) --- */
  React.useEffect(() => {
    const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
    const els = document.querySelectorAll<HTMLElement>(selectors);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* Ambient overlays */}
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <div className="deco-grid" />

      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <CtaBanner />
      <Footer />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>{PERSONAL.name} — Portfolio</title>
    <meta name="description" content={PERSONAL.tagline} />
    <meta name="theme-color" content="#0A0A0A" />
  </>
);
