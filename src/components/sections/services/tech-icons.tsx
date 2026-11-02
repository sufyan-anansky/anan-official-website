import type { ReactNode, SVGProps } from "react";

export type TechIconName =
  | "react"
  | "python"
  | "redux"
  | "flutter"
  | "kotlin"
  | "typescript"
  | "node"
  | "next";

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const glyphs: Record<TechIconName, ReactNode> = {
  react: (
    <>
      <g {...line}>
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    </>
  ),
  python: (
    <>
      <g {...line}>
        <path d="M12 3.5H9.2a2.7 2.7 0 0 0-2.7 2.7v2.3H12v1H5.4A2.4 2.4 0 0 0 3 11.9v1.6a2.4 2.4 0 0 0 2.4 2.4h1.1v-2a2.7 2.7 0 0 1 2.7-2.7h3.6A2.2 2.2 0 0 0 15 8.9V6.2a2.7 2.7 0 0 0-3-2.7z" />
        <path
          d="M12 3.5H9.2a2.7 2.7 0 0 0-2.7 2.7v2.3H12v1H5.4A2.4 2.4 0 0 0 3 11.9v1.6a2.4 2.4 0 0 0 2.4 2.4h1.1v-2a2.7 2.7 0 0 1 2.7-2.7h3.6A2.2 2.2 0 0 0 15 8.9V6.2a2.7 2.7 0 0 0-3-2.7z"
          transform="rotate(180 12 12)"
        />
      </g>
      <circle cx="9.6" cy="5.8" r="0.7" fill="currentColor" />
      <circle cx="14.4" cy="18.2" r="0.7" fill="currentColor" />
    </>
  ),
  redux: (
    <>
      <g {...line}>
        <path d="M12 6.4c-3 1.4-4.7 4.4-4.7 7.1" />
        <path d="M7.6 17.5c3 .9 6.1.3 8.4-2.1" />
        <path d="M16.8 15c.7-3.2-.1-6.5-3-8.5" />
      </g>
      <circle cx="12" cy="5" r="1.8" {...line} />
      <circle cx="6.2" cy="16.4" r="1.8" {...line} />
      <circle cx="17.8" cy="16.4" r="1.8" {...line} />
    </>
  ),
  flutter: (
    <g fill="currentColor">
      <path d="M14.5 3 5 12.5l2.8 2.8L17.3 5.8z" />
      <path d="M14.5 11.5 10.9 15.1l3.6 3.6H18l-3.6-3.6L18 11.5z" />
    </g>
  ),
  kotlin: <path d="M4 4h16l-8 8 8 8H4z" fill="currentColor" />,
  typescript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" {...line} />
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fontSize="8.6"
        fontWeight="700"
        fill="currentColor"
        style={{ direction: "ltr" }}
      >
        TS
      </text>
    </>
  ),
  node: (
    <>
      <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z" {...line} />
      <text
        x="12"
        y="14.6"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="currentColor"
        style={{ direction: "ltr" }}
      >
        JS
      </text>
    </>
  ),
  next: (
    <>
      <circle cx="12" cy="12" r="9" {...line} />
      <path d="M9.6 8.6v6.8M9.6 8.6l5.8 7.2M14.8 8.6v3.6" {...line} />
    </>
  ),
};

type TechIconProps = SVGProps<SVGSVGElement> & Readonly<{ name: TechIconName }>;

export function TechIcon({ name, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {glyphs[name]}
    </svg>
  );
}
