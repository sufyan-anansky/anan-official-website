"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { MousePointer2, Puzzle } from "lucide-react";
import { useLocale } from "next-intl";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TechIcon,
  type TechIconName,
} from "@/components/sections/services/tech-icons";
import type { services } from "@/content/services";
import { cn } from "@/lib/cn";

type ServiceId = (typeof services)[number]["id"];

export type ServiceVisualLabels = Readonly<{
  tagNew: string;
  tagReviewed: string;
  notifications: ReadonlyArray<Readonly<{ title: string; time: string }>>;
  ai: string;
  design: Readonly<{
    title: string;
    description: string;
    note: string;
    defaultAction: string;
    boldAction: string;
  }>;
}>;

type VisualProps = Readonly<{
  labels: ServiceVisualLabels;
  hovered: boolean;
}>;

type ServiceVisualProps = VisualProps &
  Readonly<{
    type: ServiceId;
  }>;

const ease = [0.16, 1, 0.3, 1] as const;

function useIsRtl() {
  return useLocale() === "ar";
}

/**
 * Every visual only animates while it is on screen and the person has not
 * asked for reduced motion. `active` drives both JS timers and the CSS
 * keyframes (through `data-active`).
 */
function useVisual<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-8% 0px -8% 0px" });
  const reducedMotion = Boolean(useReducedMotion());
  return { ref, active: inView && !reducedMotion, reducedMotion };
}

/* -------------------------------------------------------------------------- */
/* 1. Workflow: notification stack with a cursor that reviews and dismisses   */
/* -------------------------------------------------------------------------- */

type NotificationCardProps = Readonly<{
  title: string;
  time: string;
  tag: string;
  isNew: boolean;
  isRtl: boolean;
  sheen: boolean;
}>;

function NotificationCard({
  title,
  time,
  tag,
  isNew,
  isRtl,
  sheen,
}: NotificationCardProps) {
  return (
    <div className="relative flex h-full items-center gap-[0.9rem] overflow-hidden rounded-[1.75rem] border border-outline-variant/40 bg-carbon-elevated p-[0.4rem] pe-[1.4rem] shadow-[0_18px_40px_-14px_rgb(0_0_0/0.85)] backdrop-blur-md">
      <span className="grid h-[4.3rem] w-[4.3rem] shrink-0 place-items-center rounded-[1.35rem] bg-carbon-base">
        <Puzzle
          className="h-8 w-8 fill-primary/90 text-primary drop-shadow-[0_0_10px_var(--color-primary)]"
          strokeWidth={1.4}
          aria-hidden="true"
        />
      </span>
      <span className="flex min-w-0 flex-col gap-[0.22rem]">
        <span
          className={cn(
            "flex items-center gap-[0.4rem] font-semibold",
            isNew ? "text-primary" : "text-text-dim",
            isRtl
              ? "font-arabic text-[0.75rem]"
              : "font-mono text-[0.62rem] uppercase tracking-[0.12em]",
          )}
        >
          <span
            className={cn(
              "h-[0.35rem] w-[0.35rem] rounded-full",
              isNew
                ? "animate-pulse bg-primary shadow-[0_0_8px_var(--color-primary)]"
                : "bg-text-dim",
            )}
          />
          {tag}
        </span>
        <span
          className={cn(
            "truncate text-[1.05rem] font-medium leading-tight text-text-pure",
            isRtl ? "font-arabic" : "font-body",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "text-[0.75rem] text-text-dim",
            isRtl ? "font-arabic" : "font-body",
          )}
        >
          {time}
        </span>
      </span>
      {sheen ? <span className="service-sheen" aria-hidden="true" /> : null}
    </div>
  );
}

function WorkflowVisual({ labels, hovered }: VisualProps) {
  const { ref, active, reducedMotion } = useVisual<HTMLDivElement>();
  const isRtl = useIsRtl();
  const flip = isRtl ? -1 : 1;
  const items = labels.notifications;
  const count = items.length;
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<"rest" | "move" | "tap">("rest");
  const [reviewed, setReviewed] = useState(false);

  // One loop: cursor glides in, taps the card to review it, a new
  // notification arrives and the reviewed one slides behind it.
  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase("move");
      timers.push(
        setTimeout(() => {
          setPhase("tap");
          setReviewed(true);
        }, 1400),
      );
      timers.push(setTimeout(() => setPhase("rest"), 1850));
      timers.push(
        setTimeout(() => {
          setTick((value) => value + 1);
          setReviewed(false);
        }, 2300),
      );
    };
    run();
    const id = setInterval(run, 5000);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [active]);

  const cards = [0, 1].map((position) => {
    const key = tick - position;
    return {
      key,
      position,
      item: items[((key % count) + count) % count],
    };
  });

  const cursorTarget =
    phase === "rest"
      ? { x: 126 * flip, y: 64, scale: 1 }
      : phase === "move"
        ? { x: 40 * flip, y: 8, scale: 1 }
        : { x: 40 * flip, y: 8, scale: 0.8 };

  return (
    <div
      ref={ref}
      data-active={active}
      className="service-visual absolute inset-x-0 top-0 h-[66%]"
    >
      <div className="absolute inset-x-[11%] top-[43%] h-[5.1rem]">
        <AnimatePresence initial={false}>
          {cards.map(({ key, position, item }) => (
            <motion.div
              key={key}
              className="absolute inset-0"
              style={{ zIndex: position === 0 ? 2 : 1 }}
              initial={{ opacity: 0, y: 30, scale: 0.94, filter: "blur(6px)" }}
              animate={
                position === 0
                  ? {
                      opacity: 1,
                      y: hovered ? 10 : 0,
                      scale: phase === "tap" ? 0.965 : 1,
                      filter: "blur(0px)",
                    }
                  : {
                      opacity: hovered ? 0.9 : 0.6,
                      y: hovered ? -40 : -26,
                      scale: hovered ? 0.93 : 0.88,
                      filter: "blur(0px)",
                    }
              }
              exit={{ opacity: 0, y: -54, scale: 0.8, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <NotificationCard
                title={item.title}
                time={item.time}
                tag={
                  position === 0 && !reviewed
                    ? labels.tagNew
                    : labels.tagReviewed
                }
                isNew={position === 0 && !reviewed}
                isRtl={isRtl}
                sheen={position === 0}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {reducedMotion ? null : (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-20"
            style={{ insetInlineStart: "50%" }}
            initial={false}
            animate={cursorTarget}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          >
            <MousePointer2
              className="h-5 w-5 fill-text-pure text-carbon-base drop-shadow-[0_4px_8px_rgb(0_0_0/0.6)]"
              strokeWidth={1.5}
            />
            <AnimatePresence>
              {phase === "tap" ? (
                <motion.span
                  key="ripple"
                  className="absolute -start-3 -top-3 h-8 w-8 rounded-full border border-primary/70"
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                />
              ) : null}
            </AnimatePresence>
          </motion.span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Tech ecosystem: honeycomb with a travelling light wave                  */
/* -------------------------------------------------------------------------- */

const HEX_W = 19;
const HEX_H = 16.45;
const HEX_STEP = HEX_H + 1.5;
const HEX_COL = HEX_STEP * 0.866;

const hexIcons: Record<string, TechIconName> = {
  "1,0": "python",
  "2,0": "typescript",
  "3,0": "redux",
  "4,1": "react",
  "5,0": "flutter",
  "5,1": "kotlin",
  "3,1": "node",
  "4,2": "next",
};

const hexGrid = (() => {
  const cells: Array<{
    id: string;
    x: string;
    y: string;
    b: string;
    d: string;
    icon?: TechIconName;
  }> = [];

  for (let col = -1; col <= 8; col += 1) {
    for (let row = -1; row <= 4; row += 1) {
      const cx = 4 + col * HEX_COL;
      const cy =
        7 + row * HEX_STEP + (Math.abs(col) % 2 === 1 ? HEX_STEP / 2 : 0);
      const distance = Math.hypot(cx - 42, cy - 20);
      cells.push({
        id: `${col}:${row}`,
        x: (cx - HEX_W / 2).toFixed(2),
        y: (cy - HEX_H / 2).toFixed(2),
        b: Math.max(0.12, 1 - distance / 70).toFixed(2),
        d: Math.max(0, cx * 0.04 + cy * 0.035).toFixed(2),
        icon: hexIcons[`${col},${row}`],
      });
    }
  }

  return cells;
})();

function EcosystemVisual() {
  const { ref, active } = useVisual<HTMLDivElement>();

  // Light the hexagons nearest the cursor. Listens on the whole card so the
  // glow still follows the pointer while it is over the text.
  useEffect(() => {
    const root = ref.current;
    const card = root?.closest<HTMLElement>("[data-service-card]");
    if (!root || !card) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-hex]"));
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const node of nodes) {
          const rect = node.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const lit = Math.max(0, 1 - Math.hypot(dx, dy) / (rect.width * 1.7));
          node.style.setProperty("--lit", (lit * lit).toFixed(3));
        }
      });
    };

    const handleLeave = () => {
      cancelAnimationFrame(frame);
      nodes.forEach((node) => node.style.setProperty("--lit", "0"));
    };

    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointermove", handleMove);
      card.removeEventListener("pointerleave", handleLeave);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      data-active={active}
      className="service-visual absolute inset-0 overflow-hidden [container-type:inline-size]"
    >
      <span
        aria-hidden="true"
        className="service-drift absolute -top-[14%] start-[16%] h-[75%] w-[48%] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent)",
        }}
      />
      <span
        aria-hidden="true"
        className="service-drift absolute -bottom-[20%] end-[6%] h-[60%] w-[38%] rounded-full [animation-delay:-6s]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent)",
        }}
      />

      <div className="absolute inset-0 origin-center -rotate-[9deg] scale-[1.1] rtl:rotate-[9deg]">
        <div className="service-grid-sway absolute inset-0">
          {hexGrid.map((hex) => (
            <span
              key={hex.id}
              data-hex
              className="service-hex"
              style={
                {
                  insetInlineStart: `${hex.x}cqw`,
                  top: `${hex.y}cqw`,
                  width: `${HEX_W}cqw`,
                  height: `${HEX_H}cqw`,
                  "--b": hex.b,
                  "--d": `${hex.d}s`,
                } as CSSProperties
              }
            >
              <span className="service-hex-face" />
              <span className="service-hex-wave" />
              <span className="service-hex-lit" />
              {hex.icon ? (
                <span className="service-hex-icon">
                  <span className="grid h-full w-full place-items-center rotate-[9deg] rtl:-rotate-[9deg]">
                    <TechIcon
                      name={hex.icon}
                      className="service-float h-[34%] w-[34%]"
                      style={{ animationDelay: `-${hex.d}s` }}
                    />
                  </span>
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <span className="service-hex-fade" aria-hidden="true" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. AI solutions: nested rings, sonar pulses, orbiting light, scramble text */
/* -------------------------------------------------------------------------- */

const aiRings = [
  { size: 220, radius: 50, opacity: 0.16, duration: 11 },
  { size: 184, radius: 42, opacity: 0.3, duration: 9 },
  { size: 146, radius: 33, opacity: 0.55, duration: 7 },
  { size: 108, radius: 25, opacity: 0.85, duration: 5.5 },
] as const;

const aiSparkles = [
  { cx: 22, cy: 30, delay: 0 },
  { cx: 198, cy: 42, delay: -1.1 },
  { cx: 30, cy: 192, delay: -2.1 },
  { cx: 192, cy: 186, delay: -0.6 },
] as const;

function useScramble(text: string, run: boolean, trigger: number) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    // if (!run) {
    //   setOutput(text);
    //   return;
    // }
    const glyphs = "01<>/{}#*+";
    const total = 14;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setOutput(
        text
          .split("")
          .map((char, index) =>
            frame > ((index + 1) * total) / text.length
              ? char
              : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join(""),
      );
      if (frame >= total) {
        clearInterval(id);
        setOutput(text);
      }
    }, 45);
    return () => clearInterval(id);
  }, [text, run, trigger]);

  return output;
}

function AiVisual({ labels, hovered }: VisualProps) {
  const { ref, active, reducedMotion } = useVisual<HTMLDivElement>();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setPulse((value) => value + 1), 6000);
    return () => clearInterval(id);
  }, [active]);

  const label = useScramble(labels.ai, active, pulse + (hovered ? 100 : 0));

  return (
    <div
      ref={ref}
      data-active={active}
      className="service-visual absolute inset-x-0 top-0 h-[66%] pt-[7.5%]"
    >
      <svg
        viewBox="-6 -6 232 232"
        className="mx-auto h-full w-auto overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="service-ai-core" cx="50%" cy="38%" r="70%">
            <stop
              offset="0"
              stopColor="var(--color-primary)"
              stopOpacity="0.22"
            />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {aiRings.map((ring, index) => {
          const offset = (220 - ring.size) / 2;
          return (
            <motion.g
              key={ring.size}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scale: hovered ? 1.04 + index * 0.015 : 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              <g
                className="service-breathe"
                style={{ animationDelay: `${index * -1.1}s` }}
              >
                <rect
                  x={offset}
                  y={offset}
                  width={ring.size}
                  height={ring.size}
                  rx={ring.radius}
                  stroke="var(--color-primary)"
                  strokeOpacity={ring.opacity}
                  fill="var(--color-primary)"
                  fillOpacity={0.015 + index * 0.006}
                />
                <rect
                  x={offset}
                  y={offset}
                  width={ring.size}
                  height={ring.size}
                  rx={ring.radius}
                  pathLength="1"
                  className={cn(
                    "service-comet",
                    index % 2 === 1 && "service-comet--rev",
                  )}
                  style={{ "--dur": `${ring.duration}s` } as CSSProperties}
                  stroke="var(--color-primary)"
                  strokeOpacity={Math.min(1, ring.opacity + 0.35)}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="0.14 0.86"
                />
              </g>
            </motion.g>
          );
        })}

        {reducedMotion
          ? null
          : [0, 1, 2].map((index) => (
              <motion.rect
                key={index}
                x={70}
                y={70}
                width={80}
                height={80}
                rx={18}
                stroke="var(--color-primary)"
                strokeWidth={1.2}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ opacity: 0, scale: 1 }}
                animate={
                  active
                    ? { opacity: [0, 0.55, 0], scale: [1, 1.6, 2.75] }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 3.6,
                  delay: index * 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  times: [0, 0.2, 1],
                }}
              />
            ))}

        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
        >
          <rect
            x={70}
            y={70}
            width={80}
            height={80}
            rx={18}
            fill="var(--color-carbon-elevated)"
            stroke="var(--color-primary)"
            strokeOpacity={0.4}
          />
          <rect
            x={70}
            y={70}
            width={80}
            height={80}
            rx={18}
            fill="url(#service-ai-core)"
          />
          <text
            x={110}
            y={110}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-display"
            fontSize={36}
            fontWeight={500}
            fill="var(--color-primary)"
            style={{
              direction: "ltr",
              filter: "drop-shadow(0 0 8px var(--color-primary))",
            }}
          >
            {label}
          </text>
        </motion.g>

        {aiSparkles.map((spark) => (
          <circle
            key={`${spark.cx}-${spark.cy}`}
            cx={spark.cx}
            cy={spark.cy}
            r={1.7}
            fill="var(--color-primary)"
            className="service-twinkle"
            style={{ animationDelay: `${spark.delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Analytics: self-drawing line, comet head, scrubbable readout            */
/* -------------------------------------------------------------------------- */

const CHART_W = 350;
const CHART_H = 240;
const CURVE_END_X = 169;
const curvePath =
  "M0 234 C34 222 66 205 92 198 C112 192 124 196 138 188 C152 180 160 168 164 150 C167 138 168 124 169 112";
const trailPath = "M169 112 C172 86 200 70 256 42 C280 30 300 24 330 14";

function AnalyticsVisual({ hovered }: VisualProps) {
  const { ref, active, reducedMotion } = useVisual<HTMLDivElement>();
  const isRtl = useIsRtl();
  const locale = useLocale();
  const pathRef = useRef<SVGPathElement>(null);
  const samples = useRef<Array<{ x: number; y: number }>>([]);

  const t = useMotionValue(0);
  const scrubX = useMotionValue(0);
  const scrubY = useMotionValue(0);
  const scrubOpacity = useMotionValue(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    samples.current = Array.from({ length: 161 }, (_, index) => {
      const point = path.getPointAtLength((total * index) / 160);
      return { x: point.x, y: point.y };
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      t.set(0.5);
      return;
    }
    if (!active) return;
    const controls = animate(t, [0, 1], {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [active, reducedMotion, t]);

  const progress = useTransform(t, (value) => {
    const x = Math.min(value / 0.3, 1);
    return 1 - Math.pow(1 - x, 4);
  });
  const fade = useTransform(t, (value) =>
    value < 0.88 ? 1 : Math.max(0, 1 - (value - 0.88) / 0.1),
  );
  const head = useTransform(progress, (value) => {
    const list = samples.current;
    if (!list.length) return { x: 0, y: 234 };
    const position = value * (list.length - 1);
    const lower = Math.floor(position);
    const upper = Math.min(lower + 1, list.length - 1);
    const mix = position - lower;
    return {
      x: list[lower].x + (list[upper].x - list[lower].x) * mix,
      y: list[lower].y + (list[upper].y - list[lower].y) * mix,
    };
  });
  const headLeft = useTransform(
    head,
    (point) => `${(point.x / CHART_W) * 100}%`,
  );
  const headTop = useTransform(
    head,
    (point) => `${(point.y / CHART_H) * 100}%`,
  );

  const scrubLeft = useTransform(
    scrubX,
    (value) => `${(value / CHART_W) * 100}%`,
  );
  const scrubTop = useTransform(
    scrubY,
    (value) => `${(value / CHART_H) * 100}%`,
  );
  const numberFormat = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        signDisplay: "always",
        maximumFractionDigits: 0,
      }),
    [locale],
  );
  const scrubText = useTransform(
    scrubY,
    (value) =>
      `${numberFormat.format(Math.round(((CHART_H - value) / CHART_H) * 100))}%`,
  );

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const list = samples.current;
    if (!list.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    let fraction = (event.clientX - rect.left) / rect.width;
    if (isRtl) fraction = 1 - fraction;
    const target = Math.min(Math.max(fraction * CHART_W, 0), CURVE_END_X);
    let best = list[0];
    let bestDistance = Infinity;
    for (const sample of list) {
      const distance = Math.abs(sample.x - target);
      if (distance < bestDistance) {
        best = sample;
        bestDistance = distance;
      }
    }
    scrubX.set(best.x);
    scrubY.set(best.y);
    animate(scrubOpacity, 1, { duration: 0.2 });
  };

  const handleLeave = () => {
    animate(scrubOpacity, 0, { duration: 0.35 });
  };

  return (
    <div
      ref={ref}
      data-active={active}
      className="service-visual absolute inset-x-0 top-0 h-[66%] [container-type:size]"
    >
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="relative aspect-[350/240] rtl:-scale-x-100"
          style={{ width: "min(100cqw, calc(100cqh * 1.4583))" }}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="service-analytics-line"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="170"
                y2="0"
              >
                <stop stopColor="var(--color-primary)" stopOpacity="0.04" />
                <stop
                  offset="0.55"
                  stopColor="var(--color-primary)"
                  stopOpacity="0.7"
                />
                <stop offset="1" stopColor="var(--color-primary)" />
              </linearGradient>
              <linearGradient
                id="service-analytics-trail"
                gradientUnits="userSpaceOnUse"
                x1="169"
                y1="112"
                x2="330"
                y2="14"
              >
                <stop stopColor="var(--color-primary)" stopOpacity="0.28" />
                <stop
                  offset="1"
                  stopColor="var(--color-primary)"
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="service-analytics-down"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop stopColor="#fff" />
                <stop offset="1" stopColor="#000" />
              </linearGradient>
              <mask id="service-analytics-mask">
                <rect
                  x="160"
                  y="140"
                  width="140"
                  height="100"
                  fill="url(#service-analytics-down)"
                />
              </mask>
            </defs>

            <g
              stroke="var(--color-primary)"
              strokeOpacity="0.3"
              strokeDasharray="1.2 6"
              strokeLinecap="round"
              mask="url(#service-analytics-mask)"
            >
              {Array.from({ length: 10 }, (_, index) => (
                <line
                  key={index}
                  x1={176 + index * 12}
                  x2={176 + index * 12}
                  y1={140}
                  y2={240}
                />
              ))}
            </g>

            <path
              d={trailPath}
              stroke="url(#service-analytics-trail)"
              strokeWidth="1.5"
            />

            <path ref={pathRef} d={curvePath} stroke="none" />
            <motion.path
              d={curvePath}
              stroke="var(--color-primary)"
              strokeOpacity="0.5"
              strokeWidth="7"
              strokeLinecap="round"
              className="blur-[6px]"
              style={{ pathLength: progress, opacity: fade }}
            />
            <motion.path
              d={curvePath}
              stroke="url(#service-analytics-line)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: progress, opacity: fade }}
            />
          </svg>

          <motion.span
            aria-hidden="true"
            className="absolute z-[1]"
            style={{ left: headLeft, top: headTop, opacity: fade }}
          >
            <span
              className="service-halo absolute -left-[1.375rem] -top-[1.375rem] h-[2.75rem] w-[2.75rem] rounded-full bg-primary/15 transition-[scale] duration-500"
              style={{ scale: hovered ? 1.25 : 1 }}
            />
            <span className="service-ping absolute -left-[1.375rem] -top-[1.375rem] h-[2.75rem] w-[2.75rem] rounded-full border border-primary/50" />
            <span className="absolute -left-[0.45rem] -top-[0.45rem] h-[0.9rem] w-[0.9rem] rounded-full bg-primary shadow-[0_0_18px_var(--color-primary)]" />
          </motion.span>

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 z-[2] w-px bg-gradient-to-b from-primary/60 to-transparent"
            style={{ left: scrubLeft, top: scrubTop, opacity: scrubOpacity }}
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute z-[3]"
            style={{ left: scrubLeft, top: scrubTop, opacity: scrubOpacity }}
          >
            <span className="absolute -left-[0.35rem] -top-[0.35rem] h-[0.7rem] w-[0.7rem] rounded-full border-2 border-primary bg-carbon-base shadow-[0_0_12px_var(--color-primary)]" />
            <span
              dir="ltr"
              className="absolute -top-[2.4rem] left-0 -translate-x-1/2 whitespace-nowrap rounded-full border border-outline-variant/60 bg-carbon-elevated/90 px-[0.6rem] py-[0.15rem] font-mono text-[0.7rem] text-primary backdrop-blur-sm rtl:-scale-x-100"
            >
              <motion.span>{scrubText}</motion.span>
            </span>
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Design: an alert whose layout adapts when the weight changes            */
/* -------------------------------------------------------------------------- */

function DesignVisual({ labels, hovered }: VisualProps) {
  const { ref, active } = useVisual<HTMLDivElement>();
  const isRtl = useIsRtl();
  const [selected, setSelected] = useState<"default" | "bold">("default");
  const [manual, setManual] = useState(false);
  const bold = selected === "bold";

  const rotateX = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 18 });

  // Alternate between the two options until someone takes over.
  useEffect(() => {
    if (!active || hovered || manual) return;
    const id = setInterval(
      () => setSelected((value) => (value === "default" ? "bold" : "default")),
      2800,
    );
    return () => clearInterval(id);
  }, [active, hovered, manual]);

  useEffect(() => {
    if (!manual) return;
    const id = setTimeout(() => setManual(false), 8000);
    return () => clearTimeout(id);
  }, [manual, selected]);

  const choose = (value: "default" | "bold") => {
    setSelected(value);
    setManual(true);
  };

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 12);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const family = isRtl ? "font-arabic" : "font-body";

  return (
    <div
      ref={ref}
      data-active={active}
      className="service-visual absolute inset-x-0 top-0 grid h-[66%] place-items-center px-[14%] pt-[4.5%]"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <motion.div
        className="relative w-full max-w-[16rem]"
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
      >
        {[0.55, 0.32, 0.16].map((opacity, index) => (
          <motion.span
            key={`${selected}-${index}`}
            aria-hidden="true"
            className="pointer-events-none absolute border border-primary"
            style={{
              inset: `-${(index + 1) * 0.55 + 0.1}rem`,
              borderRadius: `${1.4 + (index + 1) * 0.55}rem`,
            }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: opacity * 0.7, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 16,
              delay: index * 0.07,
            }}
          />
        ))}

        <div className="relative overflow-hidden rounded-[1.4rem] border border-outline-variant/50 bg-carbon-base shadow-[0_24px_50px_-18px_rgb(0_0_0/0.9)]">
          <div className="px-lg pb-[0.9rem] pt-[1rem] text-center">
            <p
              className={cn(
                "text-[1rem] text-text-pure transition-[font-weight] duration-300",
                bold ? "font-bold" : "font-medium",
                isRtl ? "font-arabic" : "font-display",
              )}
            >
              {labels.design.title}
            </p>
            <p
              className={cn(
                "mt-[0.2rem] text-[0.78rem] leading-snug transition-colors duration-300",
                bold ? "font-semibold text-text-pure" : "text-text-muted",
                family,
              )}
            >
              {labels.design.description}
            </p>
            <AnimatePresence initial={false}>
              {bold ? (
                <motion.p
                  key="note"
                  className={cn(
                    "overflow-hidden text-[0.72rem] text-primary",
                    family,
                  )}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <span className="block pt-[0.35rem]">
                    {labels.design.note}
                  </span>
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <div
            role="group"
            className="relative flex border-t border-outline-variant/50"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 start-0 w-1/2 bg-primary/10"
              animate={{ x: bold ? (isRtl ? "-100%" : "100%") : "0%" }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
            {(["default", "bold"] as const).map((value, index) => (
              <motion.button
                key={value}
                type="button"
                aria-pressed={selected === value}
                onClick={() => choose(value)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex-1 py-[0.7rem] text-[0.9rem] text-primary outline-none transition-colors hover:text-text-pure focus-visible:bg-primary/10",
                  index === 0 && "border-e border-outline-variant/50",
                  value === "bold" && "font-semibold",
                  family,
                )}
              >
                {value === "default"
                  ? labels.design.defaultAction
                  : labels.design.boldAction}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function ServiceVisual({ type, labels, hovered }: ServiceVisualProps) {
  switch (type) {
    case "workflows":
      return <WorkflowVisual labels={labels} hovered={hovered} />;
    case "platforms":
      return <EcosystemVisual />;
    case "data":
      return <AiVisual labels={labels} hovered={hovered} />;
    case "analytics":
      return <AnalyticsVisual labels={labels} hovered={hovered} />;
    case "reporting":
      return <DesignVisual labels={labels} hovered={hovered} />;
  }
}
