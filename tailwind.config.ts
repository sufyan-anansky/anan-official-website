import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          bright: "var(--color-surface-bright)",
          container: "var(--color-surface-container)",
          "container-low": "var(--color-surface-container-low)",
          "container-lowest": "var(--color-surface-container-lowest)",
          "container-high": "var(--color-surface-container-high)",
          "container-highest": "var(--color-surface-container-highest)",
          variant: "var(--color-surface-variant)",
        },
        on: {
          surface: "var(--color-on-surface)",
          "surface-variant": "var(--color-on-surface-variant)",
          background: "var(--color-on-background)",
          primary: "var(--color-on-primary)",
          "primary-container": "var(--color-on-primary-container)",
          secondary: "var(--color-on-secondary)",
          "secondary-container": "var(--color-on-secondary-container)",
          tertiary: "var(--color-on-tertiary)",
          "tertiary-container": "var(--color-on-tertiary-container)",
          error: "var(--color-on-error)",
          "error-container": "var(--color-on-error-container)",
          "primary-fixed": "var(--color-on-primary-fixed)",
          "primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
          "secondary-fixed": "var(--color-on-secondary-fixed)",
          "secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
          "tertiary-fixed": "var(--color-on-tertiary-fixed)",
          "tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        },
        inverse: {
          surface: "var(--color-inverse-surface)",
          "on-surface": "var(--color-inverse-on-surface)",
          primary: "var(--color-inverse-primary)",
        },
        outline: {
          DEFAULT: "var(--color-outline)",
          variant: "var(--color-outline-variant)",
        },
        carbon: {
          base: "var(--color-carbon-base)",
          surface: "var(--color-carbon-surface)",
          elevated: "var(--color-carbon-elevated)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          container: "var(--color-primary-container)",
          fixed: "var(--color-primary-fixed)",
          "fixed-dim": "var(--color-primary-fixed-dim)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          container: "var(--color-secondary-container)",
          fixed: "var(--color-secondary-fixed)",
          "fixed-dim": "var(--color-secondary-fixed-dim)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          container: "var(--color-tertiary-container)",
          fixed: "var(--color-tertiary-fixed)",
          "fixed-dim": "var(--color-tertiary-fixed-dim)",
        },
        text: {
          pure: "var(--color-text-pure)",
          muted: "var(--color-text-muted)",
          dim: "var(--color-text-dim)",
          body: "var(--color-on-surface)",
          "body-variant": "var(--color-on-surface-variant)",
        },
        border: {
          hairline: "var(--color-border-hairline)",
          subtle: "var(--color-border-subtle)",
          outline: "var(--color-outline)",
          "outline-variant": "var(--color-outline-variant)",
        },
        accent: {
          emerald: "var(--color-accent-emerald)",
          leaf: "var(--color-accent-leaf)",
          lime: "var(--color-accent-lime)",
        },
        glow: {
          emerald: "var(--color-glow-emerald)",
        },
        background: "var(--color-background)",
        error: {
          DEFAULT: "var(--color-error)",
          container: "var(--color-error-container)",
        },
        "surface-tint": "var(--color-surface-tint)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        arabic: ["var(--font-arabic)", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "4.5rem",
          { lineHeight: "5rem", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        "display-xl-mobile": [
          "2.5rem",
          { lineHeight: "3rem", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        "headline-lg": [
          "3rem",
          { lineHeight: "3.5rem", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
        "headline-lg-mobile": [
          "2rem",
          { lineHeight: "2.5rem", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "headline-md": [
          "2rem",
          { lineHeight: "2.5rem", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "headline-sm": [
          "1.5rem",
          { lineHeight: "2rem", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "studio-title": [
          "0.875rem",
          { lineHeight: "1.25rem", letterSpacing: "0.18em", fontWeight: "600" },
        ],
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.75rem", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "body-md": [
          "0.9375rem",
          { lineHeight: "1.5rem", letterSpacing: "-0.005em", fontWeight: "400" },
        ],
        "body-sm": [
          "0.8125rem",
          { lineHeight: "1.25rem", letterSpacing: "0em", fontWeight: "400" },
        ],
        "label-mono-md": [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.06em", fontWeight: "500" },
        ],
        "label-mono-sm": [
          "0.625rem",
          { lineHeight: "0.875rem", letterSpacing: "0.08em", fontWeight: "500" },
        ],
      },
      spacing: {
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
        "5xl": "var(--space-5xl)",
        gutter: "var(--grid-gutter)",
        margin: "var(--grid-margin)",
        "margin-tablet": "var(--grid-margin-tablet)",
        "margin-mobile": "var(--grid-margin-mobile)",
        touch: "var(--touch-target-min)",
        navbar: "var(--navbar-height)",
      },
      maxWidth: {
        canvas: "var(--container-max)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-default)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
};

export default config;
