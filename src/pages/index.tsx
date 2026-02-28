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
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const cursorDotRef = React.useRef<HTMLDivElement>(null);
  const cursorGlowRef = React.useRef<HTMLDivElement>(null);

  /* --- Custom 3D Cursor --- */
  React.useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    const glow = cursorGlowRef.current;
    if (!cursor || !dot || !glow) return;

    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let dx = 0, dy = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };

    const animate = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      dx += (mx - dx) * 0.06;
      dy += (my - dy) * 0.06;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      glow.style.transform = `translate(${dx - 100}px, ${dy - 100}px)`;
      requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      cursor.classList.add("cursor--hover");
      dot.classList.add("cursor-dot--hover");
    };
    const onLeaveLink = () => {
      cursor.classList.remove("cursor--hover");
      dot.classList.remove("cursor-dot--hover");
    };

    window.addEventListener("mousemove", onMove);
    requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button, [role='button']");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  /* --- Bidirectional Scroll Reveal (re-reveals on scroll up) --- */
  React.useEffect(() => {
    const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
    const els = document.querySelectorAll<HTMLElement>(selectors);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          } else {
            entry.target.classList.remove("revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* --- 3D Tilt on cards (mouse tracking) --- */
  React.useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".tilt-3d");

    const handleMouse = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    };

    const handleLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouse);
      card.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouse);
        card.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  /* --- Magnetic hover on skill icons --- */
  React.useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".skills__icon-item");
    const MAGNETIC_RANGE = 60; // px around center to magnetize

    const onMouseMove = (e: MouseEvent) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RANGE) {
          const pull = (1 - dist / MAGNETIC_RANGE) * 12;
          const moveX = (dx / dist) * pull;
          const moveY = (dy / dist) * pull;
          item.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + (1 - dist / MAGNETIC_RANGE) * 0.08})`;
          item.style.zIndex = "5";
        }
      });
    };

    const onMouseLeaveItem = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "";
      el.style.zIndex = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    items.forEach((item) => {
      item.addEventListener("mouseleave", onMouseLeaveItem);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      items.forEach((item) => {
        item.removeEventListener("mouseleave", onMouseLeaveItem);
      });
    };
  }, []);

  /* --- Interactive floating particles (mouse repel) --- */
  React.useEffect(() => {
    const container = document.querySelector<HTMLElement>(".floating-particles");
    if (!container) return;

    const dots: { el: HTMLDivElement; x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; size: number }[] = [];
    const PARTICLE_COUNT = 12;
    const REPULSE_R = 150;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement("div");
      el.className = "particle-interactive";
      const size = 2 + Math.random() * 3;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      container.appendChild(el);
      dots.push({ el, x, y, baseX: x, baseY: y, vx: 0, vy: 0, size });
    }

    let mx = 0, my = 0;
    let rafId = 0;

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animate = () => {
      dots.forEach((d) => {
        // Float drift
        d.baseX += (Math.random() - 0.5) * 0.3;
        d.baseY -= 0.2 + Math.random() * 0.1;
        if (d.baseY < -20) { d.baseY = window.innerHeight + 20; d.baseX = Math.random() * window.innerWidth; }

        // Mouse repulsion
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_R && dist > 0) {
          const force = (1 - dist / REPULSE_R) * 3;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // Spring back to base
        d.vx += (d.baseX - d.x) * 0.02;
        d.vy += (d.baseY - d.y) * 0.02;
        d.vx *= 0.95;
        d.vy *= 0.95;
        d.x += d.vx;
        d.y += d.vy;

        d.el.style.transform = `translate(${d.x - d.baseX}px, ${d.y - d.baseY}px)`;
        d.el.style.left = `${d.baseX}px`;
        d.el.style.top = `${d.baseY}px`;

        // Glow when near mouse
        const brightness = dist < REPULSE_R ? 0.3 + (1 - dist / REPULSE_R) * 0.7 : 0.3;
        d.el.style.opacity = `${brightness}`;
      });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouse);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(rafId);
      dots.forEach((d) => d.el.remove());
    };
  }, []);

  /* --- Parallax scroll for depth layers --- */
  React.useEffect(() => {
    const layers = document.querySelectorAll<HTMLElement>("[data-parallax]");
    const onScroll = () => {
      const scrollY = window.scrollY;
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax || "0.1");
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      {/* Custom 3D cursor */}
      <div ref={cursorGlowRef} className="cursor-glow" />
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={cursorDotRef} className="cursor-dot" />

      {/* Ambient overlays */}
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <div className="deco-grid" />

      {/* Floating 3D particles */}
      <div className="floating-particles" aria-hidden="true">
        <div className="particle particle--1" />
        <div className="particle particle--2" />
        <div className="particle particle--3" />
        <div className="particle particle--4" />
        <div className="particle particle--5" />
        <div className="particle particle--6" />
      </div>

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
