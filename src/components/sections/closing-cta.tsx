"use client";

import Matter from "matter-js";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

// size = responsive Tailwind size (radius is measured from the DOM)
// at   = spawn position as a fraction of the card [x, y]
const ORBS = [
  { size: "h-8 w-8 sm:h-12 sm:w-12", at: [0.1, 0.22] },
  { size: "h-14 w-14 sm:h-20 sm:w-20", at: [0.22, 0.1] },
  { size: "h-7 w-7 sm:h-10 sm:w-10", at: [0.72, 0.12] },
  { size: "h-16 w-16 sm:h-28 sm:w-28", at: [0.9, 0.2] },
  { size: "h-20 w-20 sm:h-36 sm:w-36", at: [0.14, 0.55] },
  { size: "h-14 w-14 sm:h-24 sm:w-24", at: [0.84, 0.55] },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.25 + i * 0.07, ease: EASE },
  }),
};

export function ClosingCta() {
  const locale = useLocale();
  const t = useTranslations("closingCta");
  const reduceMotion = Boolean(useReducedMotion());
  const isRtl = locale === "ar";

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  const words = t("title").split(" ");

  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    const els = orbRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!card || els.length === 0) return;

    const radii = els.map((el) => el.offsetWidth / 2);
    const place = (i: number, x: number, y: number) => {
      els[i].style.transform = `translate3d(${x - radii[i]}px, ${
        y - radii[i]
      }px, 0)`;
    };

    // Reduced motion: no simulation, just rest the orbs at their spawn points
    if (reduceMotion) {
      const w = card.clientWidth;
      const h = card.clientHeight;
      ORBS.forEach((o, i) => place(i, o.at[0] * w, o.at[1] * h));
      // setReady(true);
      return;
    }

    const { Engine, Bodies, Body, Composite, Constraint } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0.7 } });
    const world = engine.world;

    const w0 = card.clientWidth;
    const h0 = card.clientHeight;

    const bodies = ORBS.map((o, i) => {
      const body = Bodies.circle(o.at[0] * w0, o.at[1] * h0, radii[i], {
        restitution: 0.72,
        friction: 0.02,
        frictionAir: 0.012,
        density: 0.0012,
      });
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 2,
      });
      return body;
    });
    Composite.add(world, bodies);

    // Walls (the hollow cavity) + an invisible block under the text on desktop
    let statics: Matter.Body[] = [];
    const buildStatics = () => {
      Composite.remove(world, statics);
      const w = card.clientWidth;
      const h = card.clientHeight;
      const T = 300;
      const opts = { isStatic: true, restitution: 0.6, friction: 0.05 };
      statics = [
        Bodies.rectangle(w / 2, -T / 2, w + T * 2, T, opts), // ceiling
        Bodies.rectangle(w / 2, h + T / 2, w + T * 2, T, opts), // floor
        Bodies.rectangle(-T / 2, h / 2, T, h + T * 2, opts), // left
        Bodies.rectangle(w + T / 2, h / 2, T, h + T * 2, opts), // right
      ];
      if (content && window.innerWidth >= 640) {
        const pad = 8;
        statics.push(
          Bodies.rectangle(
            content.offsetLeft + content.offsetWidth / 2,
            content.offsetTop + content.offsetHeight / 2,
            content.offsetWidth + pad * 2,
            content.offsetHeight + pad * 2,
            { ...opts, chamfer: { radius: 28 } },
          ),
        );
      }
      Composite.add(world, statics);

      // Rescue any orb that ended up outside after a resize
      bodies.forEach((b, i) => {
        const r = radii[i];
        Body.setPosition(b, {
          x: Math.min(Math.max(b.position.x, r), w - r),
          y: Math.min(Math.max(b.position.y, r), h - r),
        });
      });
    };
    buildStatics();

    // Dragging (pointer events, so touch scrolling elsewhere stays untouched)
    let dragging: { constraint: Matter.Constraint; id: number } | null = null;

    const localPoint = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const sx = rect.width / card.clientWidth || 1;
      const sy = rect.height / card.clientHeight || 1;
      return {
        x: (e.clientX - rect.left) / sx,
        y: (e.clientY - rect.top) / sy,
      };
    };

    const cleanups: (() => void)[] = [];
    els.forEach((el, i) => {
      const down = (e: PointerEvent) => {
        if (dragging) return;
        const p = localPoint(e);
        const body = bodies[i];
        const constraint = Constraint.create({
          pointA: p,
          bodyB: body,
          pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
          stiffness: 0.16,
          damping: 0.14,
          length: 0,
        });
        Composite.add(world, constraint);
        dragging = { constraint, id: e.pointerId };
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
        setTouched(true);
      };
      const move = (e: PointerEvent) => {
        if (!dragging || dragging.id !== e.pointerId) return;
        dragging.constraint.pointA = localPoint(e);
      };
      const up = (e: PointerEvent) => {
        if (!dragging || dragging.id !== e.pointerId) return;
        Composite.remove(world, dragging.constraint);
        dragging = null;
        el.style.cursor = "grab";
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      cleanups.push(() => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      });
    });

    // Mouse hover gently pushes nearby orbs away
    let pointer: { x: number; y: number } | null = null;
    const onCardMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = localPoint(e);
    };
    const onCardLeave = () => (pointer = null);
    card.addEventListener("pointermove", onCardMove);
    card.addEventListener("pointerleave", onCardLeave);

    // Simulation loop, only runs while the card is on screen
    let raf = 0;
    let last = 0;
    let time = 0;
    const REPEL_RADIUS = 120;

    const tick = (now: number) => {
      const dt = Math.min(now - last || 16.67, 32);
      last = now;
      time += dt / 1000;

      // Slow side-to-side gravity drift keeps everything alive
      engine.gravity.x = Math.sin(time * 0.6) * 0.12;

      if (pointer && !dragging) {
        bodies.forEach((b) => {
          const dx = b.position.x - pointer!.x;
          const dy = b.position.y - pointer!.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < REPEL_RADIUS) {
            const f = (1 - d / REPEL_RADIUS) * 0.004 * b.mass;
            Body.applyForce(b, b.position, {
              x: (dx / d) * f,
              y: (dy / d) * f,
            });
          }
        });
      }

      Engine.update(engine, dt);

      bodies.forEach((b, i) => {
        const speed = Math.hypot(b.velocity.x, b.velocity.y);
        if (speed > 38) {
          Body.setVelocity(b, {
            x: (b.velocity.x / speed) * 38,
            y: (b.velocity.y / speed) * 38,
          });
        }
        place(i, b.position.x, b.position.y);
      });

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    bodies.forEach((b, i) => place(i, b.position.x, b.position.y));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(card);

    const ro = new ResizeObserver(buildStatics);
    ro.observe(card);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      cleanups.forEach((fn) => fn());
      card.removeEventListener("pointermove", onCardMove);
      card.removeEventListener("pointerleave", onCardLeave);
      Composite.clear(world, false);
      Engine.clear(engine);
    };
  }, [reduceMotion]);

  return (
    <section
      aria-labelledby="closing-cta-title"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate mx-auto max-w-7xl overflow-hidden px-margin-mobile py-4xl sm:px-margin-tablet sm:py-5xl lg:px-margin"
    >
      <motion.div
        ref={cardRef}
        initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.8, ease: EASE }
        }
        // inset shadows = the hollowed-out cavity
        className="relative isolate flex min-h-[25rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-outline-variant/60 bg-[linear-gradient(112deg,color-mix(in_srgb,var(--color-carbon-surface)_98%,transparent),color-mix(in_srgb,var(--color-surface-container-high)_92%,transparent))] px-lg py-3xl text-center shadow-[inset_0_30px_70px_rgb(0_0_0_/_0.55),inset_0_-1px_0_rgb(255_255_255_/_0.05),0_25px_50px_-12px_rgb(0_0_0_/_0.5)] sm:min-h-[28rem] sm:rounded-[2.5rem] sm:px-3xl"
      >
        {/* Breathing emerald glow */}
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_52%,var(--color-glow-emerald),transparent_66%)]"
        />

        {/* Light sweep across the cavity */}
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { x: ["-60%", "60%"] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(130deg,transparent_15%,rgb(255_255_255_/_0.035)_50%,transparent_85%)]"
        />

        {/* Physics orbs */}
        {ORBS.map((orb, i) => (
          <span
            key={i}
            ref={(el) => {
              orbRefs.current[i] = el;
            }}
            className={`absolute left-0 top-0 z-0 cursor-grab touch-none select-none ${orb.size}`}
          >
            <span
              aria-hidden="true"
              style={{ transitionDelay: `${i * 90}ms` }}
              className={`block h-full w-full rounded-full border border-white/10 bg-[radial-gradient(circle_at_32%_26%,rgb(255_255_255_/_0.72),color-mix(in_srgb,var(--color-primary)_78%,transparent)_16%,color-mix(in_srgb,var(--color-carbon-elevated)_96%,transparent)_72%)] shadow-[inset_-10px_-14px_24px_rgb(0_0_0_/_0.5),inset_5px_6px_14px_rgb(255_255_255_/_0.18),0_8px_32px_var(--color-glow-emerald)] transition-all duration-700 ease-out hover:brightness-125 ${
                ready ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
          </span>
        ))}

        {/* Content: not clickable, so orbs underneath can be grabbed. Buttons opt back in */}
        <motion.div
          ref={contentRef}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.65, delay: 0.12, ease: EASE }
          }
          className="pointer-events-none z-10 flex max-w-3xl flex-col items-center"
        >
          {/* Word-by-word title reveal */}
          <h2
            id="closing-cta-title"
            aria-label={t("title")}
            className={`text-headline-lg-mobile font-medium leading-tight text-text-pure sm:text-headline-lg ${
              isRtl ? "font-arabic" : "font-display"
            }`}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                aria-hidden="true"
                custom={i}
                variants={wordVariants}
                initial={reduceMotion ? "visible" : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                className="me-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className={`mt-md max-w-2xl text-text-muted ${
              isRtl
                ? "font-arabic text-body-md"
                : "font-body text-body-md sm:text-body-lg"
            }`}
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
            className="pointer-events-auto mt-xl flex w-full flex-col justify-center gap-sm sm:w-auto sm:flex-row sm:gap-md"
          >
            <ButtonLink
              href="/#contact"
              variant="primary"
              className={`w-full rounded-full px-xl sm:w-auto ${
                isRtl ? "font-arabic" : "font-body"
              }`}
            >
              {t("primaryCta")}
              <ArrowUpRight
                aria-hidden="true"
                className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
            </ButtonLink>
            <ButtonLink
              href="/#services"
              variant="secondary"
              className={`w-full rounded-full px-xl sm:w-auto ${
                isRtl ? "font-arabic" : "font-body"
              }`}
            >
              {t("secondaryCta")}
              <ArrowUpRight
                aria-hidden="true"
                className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`}
              />
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* Hint, fades after the first interaction */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-md z-10 text-center text-label-mono-sm text-text-dim transition-opacity duration-500 ${
            touched || !ready ? "opacity-0" : "opacity-100"
          } ${isRtl ? "font-arabic" : "font-mono uppercase tracking-[0.12em]"}`}
        >
          {t("hint")}
        </span>
      </motion.div>
    </section>
  );
}
