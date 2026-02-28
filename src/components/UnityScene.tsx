import React, { useRef, useEffect, useCallback } from "react";

/* ============================================
   UnityScene — HEAVY Canvas Background
   Lots of floating shapes, perspective grid,
   dense particles with constellation links,
   scanlines, and depth layers.
   NOW WITH: mouse repulsion, click shockwave,
   shape proximity glow.
   ============================================ */

type ShapeType = "square" | "triangle" | "line" | "cross" | "hexagon" | "diamond" | "circle" | "bracket" | "dotGrid";

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  type: ShapeType;
  drift: { x: number; y: number };
  pulsePhase: number;
  layer: number; // 0=far, 1=mid, 2=near
  // Interactive velocity from repulsion / shockwave
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  opacity: number;
  pulsePhase: number;
  layer: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

const SHAPE_COUNT = 45;
const PARTICLE_COUNT = 160;
const MOUSE_REPULSE_RADIUS = 120;
const MOUSE_REPULSE_FORCE = 1.8;
const SHAPE_GLOW_RADIUS = 180;

const UnityScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const rawMouse = useRef({ x: 0, y: 0 }); // pixel coords for interactions
  const shapes = useRef<Shape[]>([]);
  const particles = useRef<Particle[]>([]);
  const shockwaves = useRef<Shockwave[]>([]);
  const animId = useRef<number>(0);
  const time = useRef(0);

  const initShapes = useCallback((w: number, h: number) => {
    const types: ShapeType[] = ["square", "triangle", "line", "cross", "hexagon", "diamond", "circle", "bracket", "dotGrid"];
    shapes.current = Array.from({ length: SHAPE_COUNT }, () => {
      const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.6 ? 1 : 2;
      const sizeMulti = layer === 0 ? 0.6 : layer === 1 ? 1 : 1.5;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: (Math.random() * 35 + 14) * sizeMulti,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * (0.003 + layer * 0.002),
        opacity: (Math.random() * 0.14 + 0.05) * (0.5 + layer * 0.3),
        type: types[Math.floor(Math.random() * types.length)],
        drift: {
          x: (Math.random() - 0.5) * (0.08 + layer * 0.06),
          y: (Math.random() - 0.5) * (0.06 + layer * 0.05),
        },
        pulsePhase: Math.random() * Math.PI * 2,
        layer,
        vx: 0,
        vy: 0,
      };
    });
  }, []);

  const initParticles = useCallback((w: number, h: number) => {
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const layer = Math.random() < 0.4 ? 0 : Math.random() < 0.7 ? 1 : 2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.4 + 0.3) * (0.6 + layer * 0.3),
        vy: -(Math.random() * 0.22 + 0.03) * (0.5 + layer * 0.3),
        vx: (Math.random() - 0.5) * 0.15,
        opacity: (Math.random() * 0.3 + 0.06) * (0.5 + layer * 0.3),
        pulsePhase: Math.random() * Math.PI * 2,
        layer,
      };
    });
  }, []);

  /* === Drawing Helpers === */
  const drawSquare = (ctx: CanvasRenderingContext2D, s: Shape) => {
    ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
    // inner square for depth
    const inner = s.size * 0.5;
    ctx.globalAlpha *= 0.4;
    ctx.strokeRect(-inner / 2, -inner / 2, inner, inner);
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, s: Shape) => {
    const h = s.size * 0.866;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-s.size / 2, h / 2);
    ctx.lineTo(s.size / 2, h / 2);
    ctx.closePath();
    ctx.stroke();
  };

  const drawLine = (ctx: CanvasRenderingContext2D, s: Shape) => {
    ctx.beginPath();
    ctx.moveTo(-s.size, 0);
    ctx.lineTo(s.size, 0);
    ctx.stroke();
    // tick marks
    for (let i = -1; i <= 1; i += 0.5) {
      ctx.beginPath();
      ctx.moveTo(s.size * i, -3);
      ctx.lineTo(s.size * i, 3);
      ctx.stroke();
    }
  };

  const drawCross = (ctx: CanvasRenderingContext2D, s: Shape) => {
    const half = s.size / 2;
    ctx.beginPath();
    ctx.moveTo(-half, 0); ctx.lineTo(half, 0);
    ctx.moveTo(0, -half); ctx.lineTo(0, half);
    ctx.stroke();
    // corner dots
    const d = half * 0.7;
    [[-d, -d], [d, -d], [-d, d], [d, d]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 1, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, s: Shape) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = Math.cos(angle) * s.size / 2;
      const y = Math.sin(angle) * s.size / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, s: Shape) => {
    const h = s.size / 2;
    const ww = s.size / 3;
    ctx.beginPath();
    ctx.moveTo(0, -h); ctx.lineTo(ww, 0); ctx.lineTo(0, h); ctx.lineTo(-ww, 0);
    ctx.closePath();
    ctx.stroke();
    // center line
    ctx.beginPath();
    ctx.moveTo(-ww, 0); ctx.lineTo(ww, 0);
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, s: Shape) => {
    ctx.beginPath();
    ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
    ctx.stroke();
    // crosshair
    ctx.beginPath();
    ctx.moveTo(-3, 0); ctx.lineTo(3, 0);
    ctx.moveTo(0, -3); ctx.lineTo(0, 3);
    ctx.stroke();
  };

  const drawBracket = (ctx: CanvasRenderingContext2D, s: Shape) => {
    const h = s.size / 2;
    const w = s.size / 5;
    // left bracket
    ctx.beginPath();
    ctx.moveTo(-w - 6, -h); ctx.lineTo(-w - 12, -h);
    ctx.lineTo(-w - 12, h); ctx.lineTo(-w - 6, h);
    ctx.stroke();
    // right bracket
    ctx.beginPath();
    ctx.moveTo(w + 6, -h); ctx.lineTo(w + 12, -h);
    ctx.lineTo(w + 12, h); ctx.lineTo(w + 6, h);
    ctx.stroke();
  };

  const drawDotGrid = (ctx: CanvasRenderingContext2D, s: Shape) => {
    const step = s.size / 3;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        ctx.beginPath();
        ctx.arc(i * step, j * step, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (shapes.current.length === 0) initShapes(w, h);
      if (particles.current.length === 0) initParticles(w, h);
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX / w;
      mouse.current.y = e.clientY / h;
      rawMouse.current.x = e.clientX;
      rawMouse.current.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      shockwaves.current.push({
        x: cx,
        y: cy,
        radius: 0,
        maxRadius: Math.max(w, h) * 0.5,
        alpha: 0.6,
        speed: 6,
      });
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("click", handleClick);

    const draw = () => {
      time.current += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse interpolation
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.06;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.06;
      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;
      const parallaxX = (mx - 0.5) * 40;
      const parallaxY = (my - 0.5) * 40;

      /* === Perspective Ground Grid === */
      const gridAlpha = 0.035 + Math.sin(time.current * 0.3) * 0.008;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${gridAlpha})`;
      ctx.lineWidth = 0.5;
      const vanishY = h * 0.32 + parallaxY * 0.5;
      const horizonSpread = 30;
      // Horizontal lines receding
      for (let i = 0; i < 18; i++) {
        const t = i / 18;
        const yy = vanishY + (h - vanishY) * (t * t);
        const squeeze = 1 - t * 0.5;
        ctx.globalAlpha = gridAlpha * (t * 0.7 + 0.3);
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - w * squeeze * 0.6 + parallaxX * (1 - t) * 0.4, yy);
        ctx.lineTo(w * 0.5 + w * squeeze * 0.6 + parallaxX * (1 - t) * 0.4, yy);
        ctx.stroke();
      }
      // Vertical lines converging to vanishing point
      for (let i = -horizonSpread; i <= horizonSpread; i += 3) {
        const topX = w / 2 + parallaxX * 0.6;
        const bottomX = w / 2 + (i / horizonSpread) * w * 0.65 + parallaxX * 0.15;
        ctx.globalAlpha = gridAlpha * (1 - Math.abs(i / horizonSpread) * 0.6);
        ctx.beginPath();
        ctx.moveTo(topX, vanishY);
        ctx.lineTo(bottomX, h);
        ctx.stroke();
      }
      ctx.restore();

      /* === Scanlines (subtle) === */
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.008)";
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }
      ctx.restore();

      /* === Mouse pixel position (for repulsion) === */
      const canvasRect = canvas.getBoundingClientRect();
      const mousePixelX = rawMouse.current.x - canvasRect.left;
      const mousePixelY = rawMouse.current.y - canvasRect.top;

      /* === Shockwave update === */
      shockwaves.current = shockwaves.current.filter((sw) => {
        sw.radius += sw.speed;
        sw.alpha *= 0.97;
        // Push particles and shapes outward
        const pushForce = 4;
        particles.current.forEach((p) => {
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - sw.radius) < 30 && dist > 0) {
            p.vx += (dx / dist) * pushForce;
            p.vy += (dy / dist) * pushForce;
          }
        });
        shapes.current.forEach((s) => {
          const dx = s.x - sw.x;
          const dy = s.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - sw.radius) < 40 && dist > 0) {
            s.vx += (dx / dist) * pushForce * 0.6;
            s.vy += (dy / dist) * pushForce * 0.6;
            s.rotSpeed += (Math.random() - 0.5) * 0.02;
          }
        });
        return sw.alpha > 0.01 && sw.radius < sw.maxRadius;
      });

      /* === Draw shockwaves === */
      shockwaves.current.forEach((sw) => {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        // Inner ring for depth
        ctx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      /* === Shapes (sorted by layer) — with proximity glow === */
      const sortedShapes = [...shapes.current].sort((a, b) => a.layer - b.layer);
      sortedShapes.forEach((s) => {
        const layerParallax = (s.layer + 1) * 0.25;
        // Apply interactive velocity + drift
        s.x += s.drift.x + parallaxX * 0.003 * layerParallax + s.vx;
        s.y += s.drift.y + parallaxY * 0.003 * layerParallax + s.vy;
        s.rotation += s.rotSpeed;
        // Friction on interactive velocity
        s.vx *= 0.96;
        s.vy *= 0.96;
        // Dampen rotation speed back to normal
        s.rotSpeed *= 0.999;

        if (s.x < -80) s.x = w + 80;
        if (s.x > w + 80) s.x = -80;
        if (s.y < -80) s.y = h + 80;
        if (s.y > h + 80) s.y = -80;

        const pulse = 1 + Math.sin(time.current * 0.7 + s.pulsePhase) * 0.25;
        const pxOff = parallaxX * layerParallax * 0.3;
        const pyOff = parallaxY * layerParallax * 0.3;

        // --- Proximity glow: shapes near cursor glow brighter ---
        const sScreenX = s.x + pxOff;
        const sScreenY = s.y + pyOff;
        const distToMouse = Math.sqrt(
          (sScreenX - mousePixelX) ** 2 + (sScreenY - mousePixelY) ** 2
        );
        const glowFactor = distToMouse < SHAPE_GLOW_RADIUS
          ? 1 + (1 - distToMouse / SHAPE_GLOW_RADIUS) * 2.5
          : 1;
        const scaleFactor = distToMouse < SHAPE_GLOW_RADIUS
          ? 1 + (1 - distToMouse / SHAPE_GLOW_RADIUS) * 0.3
          : 1;
        const alpha = s.opacity * pulse * glowFactor;

        ctx.save();
        ctx.translate(sScreenX, sScreenY);
        ctx.scale(scaleFactor, scaleFactor);
        ctx.rotate(s.rotation);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.85)})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.85)})`;
        ctx.lineWidth = (s.layer === 2 ? 1.2 : s.layer === 1 ? 0.8 : 0.5) * glowFactor;
        ctx.globalAlpha = 1;

        // Draw glow halo for nearby shapes
        if (distToMouse < SHAPE_GLOW_RADIUS) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
          ctx.shadowBlur = 12 * (1 - distToMouse / SHAPE_GLOW_RADIUS);
        }

        switch (s.type) {
          case "square": drawSquare(ctx, s); break;
          case "triangle": drawTriangle(ctx, s); break;
          case "line": drawLine(ctx, s); break;
          case "cross": drawCross(ctx, s); break;
          case "hexagon": drawHexagon(ctx, s); break;
          case "diamond": drawDiamond(ctx, s); break;
          case "circle": drawCircle(ctx, s); break;
          case "bracket": drawBracket(ctx, s); break;
          case "dotGrid": drawDotGrid(ctx, s); break;
        }
        ctx.restore();
      });

      /* === Particles (layered) — with mouse repulsion === */
      particles.current.forEach((p) => {
        const layerParallax = (p.layer + 1) * 0.2;

        // Mouse repulsion: particles flee from cursor
        const dx = p.x - mousePixelX;
        const dy = p.y - mousePixelY;
        const distSq = dx * dx + dy * dy;
        const repulseR = MOUSE_REPULSE_RADIUS * (1 + p.layer * 0.3);
        if (distSq < repulseR * repulseR && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repulseR) * MOUSE_REPULSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Apply velocity with friction
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx + parallaxX * 0.002 * layerParallax;
        p.y += p.vy + parallaxY * 0.002 * layerParallax;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const pulse = 1 + Math.sin(time.current * 1.3 + p.pulsePhase) * 0.3;

        const px = p.x + parallaxX * layerParallax * 0.2;
        const py = p.y + parallaxY * layerParallax * 0.2;

        // Proximity glow for particles too
        const pDistToMouse = Math.sqrt(
          (px - mousePixelX) ** 2 + (py - mousePixelY) ** 2
        );
        const pGlow = pDistToMouse < MOUSE_REPULSE_RADIUS * 1.5
          ? 1 + (1 - pDistToMouse / (MOUSE_REPULSE_RADIUS * 1.5)) * 2
          : 1;
        const alpha = Math.min(p.opacity * pulse * pGlow, 0.9);

        ctx.beginPath();
        ctx.arc(px, py, p.r * (pGlow > 1 ? 1 + (pGlow - 1) * 0.3 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        if (pDistToMouse < MOUSE_REPULSE_RADIUS) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
          ctx.shadowBlur = 8 * (1 - pDistToMouse / MOUSE_REPULSE_RADIUS);
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      });

      /* === Constellation lines (denser, by layer) === */
      const connectionRadius = 110;
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          if (Math.abs(a.layer - b.layer) > 1) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionRadius * connectionRadius) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / connectionRadius) * 0.06;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      /* === Corner brackets (HUD-style) === */
      const bracketSize = 40;
      const bracketAlpha = 0.06 + Math.sin(time.current * 0.5) * 0.02;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${bracketAlpha})`;
      ctx.lineWidth = 1;
      const margin = 50 + parallaxX * 0.1;
      const marginY = 50 + parallaxY * 0.1;
      // top-left
      ctx.beginPath();
      ctx.moveTo(margin, marginY + bracketSize);
      ctx.lineTo(margin, marginY);
      ctx.lineTo(margin + bracketSize, marginY);
      ctx.stroke();
      // top-right
      ctx.beginPath();
      ctx.moveTo(w - margin - bracketSize, marginY);
      ctx.lineTo(w - margin, marginY);
      ctx.lineTo(w - margin, marginY + bracketSize);
      ctx.stroke();
      // bottom-left
      ctx.beginPath();
      ctx.moveTo(margin, h - marginY - bracketSize);
      ctx.lineTo(margin, h - marginY);
      ctx.lineTo(margin + bracketSize, h - marginY);
      ctx.stroke();
      // bottom-right
      ctx.beginPath();
      ctx.moveTo(w - margin - bracketSize, h - marginY);
      ctx.lineTo(w - margin, h - marginY);
      ctx.lineTo(w - margin, h - marginY - bracketSize);
      ctx.stroke();
      ctx.restore();

      /* === Floating orbital ring === */
      const orbitX = w / 2 + parallaxX * 0.8;
      const orbitY = h / 2 + parallaxY * 0.6;
      const orbitR = Math.min(w, h) * 0.28;
      const orbitAlpha = 0.03 + Math.sin(time.current * 0.4) * 0.01;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${orbitAlpha})`;
      ctx.lineWidth = 0.6;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.ellipse(orbitX, orbitY, orbitR, orbitR * 0.25, time.current * 0.1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // orbiting dot
      const dotAngle = time.current * 0.3;
      const dotX = orbitX + Math.cos(dotAngle) * orbitR;
      const dotY = orbitY + Math.sin(dotAngle) * orbitR * 0.25;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${orbitAlpha * 4})`;
      ctx.fill();
      ctx.restore();

      animId.current = requestAnimationFrame(draw);
    };

    animId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("click", handleClick);
    };
  }, [initShapes, initParticles]);

  return <canvas ref={canvasRef} className="hero__canvas" />;
};

export default UnityScene;
