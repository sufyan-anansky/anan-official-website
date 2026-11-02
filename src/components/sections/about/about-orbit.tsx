"use client";

import { useGSAP } from "@gsap/react";
import {
  Blocks,
  BriefcaseBusiness,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type PrincipleKey = "solutions" | "business" | "partnership";

// ring 0 = outer solid ring, ring 1 = inner dashed ring
const NODES: {
  key: PrincipleKey;
  icon: LucideIcon;
  ring: 0 | 1;
  angle: number;
}[] = [
  { key: "solutions", icon: Blocks, ring: 0, angle: -62 },
  { key: "partnership", icon: Handshake, ring: 0, angle: 118 },
  { key: "business", icon: BriefcaseBusiness, ring: 1, angle: 24 },
];

const RING_SPEEDS = [10, -7.5]; // degrees per second

type Props = {
  isRtl: boolean;
  active: PrincipleKey | null;
  onSelect: (key: PrincipleKey | null) => void;
};

export function AboutOrbit({ isRtl, active, onSelect }: Props) {
  const t = useTranslations("about");

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const coreInnerRef = useRef<HTMLDivElement>(null);
  const coreIconRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef<PrincipleKey | null>(active);

  useEffect(() => {
    activeRef.current = active;

    const panel = panelRef.current;
    if (
      !panel ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }, [active]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      const tilt = tiltRef.current;
      const sweep = sweepRef.current;
      const core = coreRef.current;
      const coreInner = coreInnerRef.current;
      const coreIcon = coreIconRef.current;
      const rippleLayer = rippleRef.current;
      if (
        !root ||
        !canvas ||
        !tilt ||
        !sweep ||
        !core ||
        !coreInner ||
        !coreIcon ||
        !rippleLayer
      ) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dir = isRtl ? -1 : 1;
      const rings = ringRefs.current.filter(Boolean) as HTMLDivElement[];
      const counters = counterRefs.current;
      const color = getComputedStyle(root).color; // root uses text-primary

      /* ---------- canvas: fireflies / constellation ---------- */
      type Particle = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        r: number;
        ph: number;
      };
      let w = 0;
      let h = 0;
      let parts: Particle[] = [];
      const pointer = { x: 0, y: 0, on: false };
      let clock = 0;

      const seed = () => {
        const n = Math.round(Math.min(56, Math.max(28, (w * h) / 9000)));
        parts = Array.from({ length: n }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          r: Math.random() * 1.6 + 0.8,
          ph: Math.random() * Math.PI * 2,
        }));
      };

      const drawFrame = (dt: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.6;

        for (const p of parts) {
          p.vx += Math.cos(p.ph + clock * 0.4) * 14 * dt;
          p.vy += Math.sin(p.ph * 1.3 + clock * 0.35) * 14 * dt;

          if (pointer.on) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d < 170) {
              const f = 1 - d / 170;
              // pulled toward the cursor with a little swirl
              p.vx += ((dx / d) * 90 + (-dy / d) * 60) * f * dt;
              p.vy += ((dy / d) * 90 + (dx / d) * 60) * f * dt;
            }
          }

          const damp = Math.exp(-0.9 * dt);
          p.vx *= damp;
          p.vy *= damp;
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }

        // constellation lines
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            const dx = parts[i].x - parts[j].x;
            const dy = parts[i].y - parts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 5625) {
              ctx.globalAlpha = (1 - Math.sqrt(d2) / 75) * 0.2;
              ctx.beginPath();
              ctx.moveTo(parts[i].x, parts[i].y);
              ctx.lineTo(parts[j].x, parts[j].y);
              ctx.stroke();
            }
          }
          if (pointer.on) {
            const dx = parts[i].x - pointer.x;
            const dy = parts[i].y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 130) {
              ctx.globalAlpha = (1 - d / 130) * 0.55;
              ctx.beginPath();
              ctx.moveTo(parts[i].x, parts[i].y);
              ctx.lineTo(pointer.x, pointer.y);
              ctx.stroke();
            }
          }
        }

        // dots with soft glow + twinkle
        for (const p of parts) {
          const twinkle = 0.6 + Math.sin(clock * 1.6 + p.ph) * 0.4;
          ctx.globalAlpha = 0.16 * twinkle;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.85 * twinkle;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      const resize = () => {
        w = root.clientWidth;
        h = root.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (parts.length === 0) seed();
        else {
          parts.forEach((p) => {
            p.x = Math.min(p.x, w);
            p.y = Math.min(p.y, h);
          });
        }
        if (!ticking) drawFrame(0);
      };

      /* ---------- pointer helpers ---------- */
      const toLocal = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const sx = r.width / (w || 1) || 1;
        const sy = r.height / (h || 1) || 1;
        return { x: (e.clientX - r.left) / sx, y: (e.clientY - r.top) / sy };
      };

      const ripple = (x: number, y: number) => {
        const el = document.createElement("span");
        el.className =
          "pointer-events-none absolute rounded-full border border-primary/60";
        el.style.cssText = `left:${x}px;top:${y}px;width:24px;height:24px;margin:-12px 0 0 -12px`;
        rippleLayer.appendChild(el);
        gsap.fromTo(
          el,
          { scale: 0.2, opacity: 0.9 },
          {
            scale: 9,
            opacity: 0,
            duration: 1.1,
            ease: "power2.out",
            onComplete: () => el.remove(),
          },
        );
      };

      const burst = (x: number, y: number) => {
        for (const p of parts) {
          const dx = p.x - x;
          const dy = p.y - y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 240) {
            const f = (1 - d / 240) * 260;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
      };

      /* ---------- tilt (3D) + cursor spotlight ---------- */
      const rxTo = gsap.quickTo(tilt, "rotationX", {
        duration: 0.7,
        ease: "power3.out",
      });
      const ryTo = gsap.quickTo(tilt, "rotationY", {
        duration: 0.7,
        ease: "power3.out",
      });
      const cxTo = gsap.quickTo(core, "x", {
        duration: 0.8,
        ease: "power3.out",
      });
      const cyTo = gsap.quickTo(core, "y", {
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.set(rings[0], { z: 0 });
      gsap.set(rings[1], { z: 28 });
      gsap.set(sweep, { z: -12 });
      gsap.set(core, { z: 64 });

      const onMove = (e: PointerEvent) => {
        const p = toLocal(e);
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.on = true;
        root.style.setProperty("--mx", `${p.x}px`);
        root.style.setProperty("--my", `${p.y}px`);
        if (reduce) return;
        const nx = (p.x / w - 0.5) * 2;
        const ny = (p.y / h - 0.5) * 2;
        ryTo(nx * 13 * dir);
        rxTo(-ny * 13);
        cxTo(nx * 10);
        cyTo(ny * 10);
      };
      const onLeave = () => {
        pointer.on = false;
        if (reduce) return;
        rxTo(0);
        ryTo(0);
        cxTo(0);
        cyTo(0);
      };
      const onDown = (e: PointerEvent) => {
        if (reduce) return;
        const p = toLocal(e);
        ripple(p.x, p.y);
        burst(p.x, p.y);
        gsap.fromTo(
          coreInner,
          { scale: 0.92 },
          { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" },
        );
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerdown", onDown);

      /* ---------- main ticker: orbit rotation + particles ---------- */
      const state = { speed: 1, boost: 0 };
      const angles = [0, 0];
      let ticking = false;

      const tick = (_time: number, deltaMs: number) => {
        const dt = Math.min(deltaMs, 50) / 1000;
        clock += dt;

        // slow down while a principle is selected / hovered
        const target = activeRef.current ? 0.12 : 1;
        state.speed += (target - state.speed) * Math.min(1, dt * 6);
        state.boost += (0 - state.boost) * Math.min(1, dt * 2.5);
        const k = state.speed + state.boost;

        rings.forEach((ring, i) => {
          angles[i] += RING_SPEEDS[i] * dir * k * dt;
          gsap.set(ring, { rotation: angles[i] });
        });
        // keep node icons upright
        NODES.forEach((node, i) => {
          const el = counters[i];
          if (el) gsap.set(el, { rotation: -angles[node.ring] });
        });
        gsap.set(sweep, { rotation: angles[0] * 2.2 });

        drawFrame(dt);
      };

      const setTicking = (on: boolean) => {
        if (on === ticking) return;
        ticking = on;
        if (on) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(root);

      if (!reduce) {
        // idle floating
        gsap.to(coreInner, {
          y: -8,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(coreIcon, {
          rotate: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 90%",
        });

        // scroll velocity gives the orbits a kick
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            state.boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 220);
          },
        });

        const io = new IntersectionObserver(
          ([entry]) => setTicking(entry.isIntersecting),
          { threshold: 0.05 },
        );
        io.observe(root);

        return () => {
          setTicking(false);
          io.disconnect();
          ro.disconnect();
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
          root.removeEventListener("pointerdown", onDown);
        };
      }

      // reduced motion: one static frame, no loops
      return () => {
        ro.disconnect();
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointerdown", onDown);
      };
    },
    { scope: rootRef, dependencies: [isRtl], revertOnUpdate: true },
  );

  const activeNode = NODES.find((n) => n.key === active);

  return (
    <div
      ref={rootRef}
      onPointerDown={(e) => {
        // tapping empty space clears a touch selection
        if (!(e.target as HTMLElement).closest("button")) onSelect(null);
      }}
      className="group relative aspect-square w-full touch-pan-y select-none text-primary [perspective:900px]"
    >
      {/* Fireflies / constellation */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Cursor spotlight */}
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 70%)",
        }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* 3D tilt layer */}
      <div
        ref={tiltRef}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Radar sweep */}
        <div
          ref={sweepRef}
          aria-hidden="true"
          className="absolute inset-[9%] rounded-full [background:conic-gradient(from_0deg,transparent_0deg,transparent_250deg,color-mix(in_srgb,var(--color-primary)_32%,transparent)_360deg)] [mask-image:radial-gradient(circle_closest-side,transparent_35%,#000_100%)]"
        />

        {/* Outer ring (2 nodes) */}
        <div
          ref={(el) => {
            ringRefs.current[0] = el;
          }}
          className="absolute inset-[9%] rounded-full border border-outline-variant/50"
        >
          <span className="absolute start-[13%] top-[19%] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_var(--color-primary)]" />
          <span className="absolute end-[11%] bottom-[23%] h-2 w-2 rounded-full bg-accent-leaf shadow-[0_0_14px_var(--color-accent-leaf)]" />
        </div>

        {/* Inner dashed ring (1 node) */}
        <div
          ref={(el) => {
            ringRefs.current[1] = el;
          }}
          className="absolute inset-[21%] rounded-full border border-dashed border-primary/25"
        />

        {/* Glow behind the core */}
        <div
          aria-hidden="true"
          className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,var(--color-glow-emerald),transparent_72%)] blur-xl"
        />

        {/* Core */}
        <div ref={coreRef} className="absolute inset-0 grid place-items-center">
          <div
            ref={coreInnerRef}
            className="grid h-[42%] w-[42%] place-items-center rounded-full border border-primary/25 bg-[radial-gradient(circle_at_35%_25%,color-mix(in_srgb,var(--color-primary)_22%,var(--color-carbon-elevated)),var(--color-carbon-surface)_68%)] shadow-[0_0_64px_var(--color-glow-emerald),inset_0_1px_0_rgb(255_255_255_/_0.08)]"
          >
            <div className="flex flex-col items-center gap-xs">
              <span ref={coreIconRef} className="inline-flex h-9 w-9">
                <Image
                  src="/brand/anan-sustainability-icon.png"
                  alt={t("visual.wordmark")}
                  width={36}
                  height={36}
                />
              </span>
              <span
                className={`text-headline-sm font-semibold text-text-pure ${
                  isRtl ? "font-arabic" : "font-display"
                }`}
              >
                {t("visual.wordmark")}
              </span>
            </div>
          </div>
        </div>

        {[0, 1].map((ringIndex) => (
          <div
            key={ringIndex}
            ref={(el) => {
              ringRefs.current[ringIndex] = el;
            }}
            className={
              ringIndex === 0
                ? "absolute inset-[9%] rounded-full border border-outline-variant/50"
                : "absolute inset-[21%] rounded-full border border-dashed border-primary/25"
            }
          >
            {ringIndex === 0 && (
              <>
                <span className="absolute start-[13%] top-[19%] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_var(--color-primary)]" />
                <span className="absolute end-[11%] bottom-[23%] h-2 w-2 rounded-full bg-accent-leaf shadow-[0_0_14px_var(--color-accent-leaf)]" />
              </>
            )}

            {NODES.map((node, i) => {
              if (node.ring !== ringIndex) return null;
              const Icon = node.icon;
              const isActive = active === node.key;
              const rad = (node.angle * Math.PI) / 180;

              return (
                <span
                  key={node.key}
                  style={{
                    left: `${50 + 50 * Math.cos(rad)}%`,
                    top: `${50 + 50 * Math.sin(rad)}%`,
                  }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    ref={(el) => {
                      counterRefs.current[i] = el;
                    }}
                    className="relative block bg-carbon-surface rounded-full motion-reduce:transform-none"
                  >
                    {!isActive && (
                      <span
                        aria-hidden="true"
                        style={{
                          animationDuration: "2.8s",
                          animationDelay: `${i * 0.5}s`,
                        }}
                        className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-primary/25 motion-reduce:hidden"
                      />
                    )}
                    <button
                      type="button"
                      aria-pressed={isActive}
                      aria-label={t(`principles.${node.key}.title`)}
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") onSelect(node.key);
                      }}
                      onPointerLeave={(e) => {
                        if (e.pointerType === "mouse") onSelect(null);
                      }}
                      onClick={(e) => {
                        const type = (e.nativeEvent as PointerEvent)
                          .pointerType;
                        if (type !== "mouse")
                          onSelect(isActive ? null : node.key);
                      }}
                      className={cn(
                        "relative grid h-11 w-11 place-items-center rounded-full border outline-none backdrop-blur-md transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-carbon-surface sm:h-14 sm:w-14",
                        isActive
                          ? "scale-125 border-primary bg-primary text-on-primary shadow-[0_0_36px_var(--color-glow-emerald)]"
                          : "border-primary/40 bg-carbon-base/70 text-primary hover:scale-110 hover:border-primary hover:shadow-[0_0_24px_var(--color-glow-emerald)]",
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      />
                    </button>
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Click ripples */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />

      {/* Info panel: caption by default, principle details when selected */}
      <div
        ref={panelRef}
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 bottom-[1%] z-30 mx-auto w-[90%] max-w-sm text-center"
      >
        {activeNode ? (
          <div className="rounded-2xl border border-primary/30 bg-carbon-surface/85 px-md py-sm shadow-xl backdrop-blur-md">
            <p
              className={`text-body-md font-semibold text-text-pure ${
                isRtl ? "font-arabic" : "font-display"
              }`}
            >
              {t(`principles.${activeNode.key}.title`)}
            </p>
            <p
              className={`mt-1 line-clamp-2 text-body-sm text-text-muted ${
                isRtl ? "font-arabic" : "font-body"
              }`}
            >
              {t(`principles.${activeNode.key}.description`)}
            </p>
          </div>
        ) : (
          <span
            className={
              isRtl
                ? "font-arabic text-body-sm"
                : "font-mono text-label-mono-sm"
            }
          >
            {t("visual.caption")}
          </span>
        )}
      </div>
    </div>
  );
}
