"use client";

import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

function updateGlassPosition(
  element: HTMLElement,
  event: PointerEvent<HTMLElement>,
) {
  if (event.pointerType !== "mouse") return;
  const rect = element.getBoundingClientRect();
  element.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
  element.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
}

export function Button({
  children,
  className,
  onPointerLeave,
  onPointerMove,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  // Same cursor-following specular light as the navbar pill. Writes CSS
  // variables directly, so pointer movement never triggers a React render.
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    updateGlassPosition(event.currentTarget, event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  };

  return (
    <button
      className={cn(
        "button",
        `button--${variant}`,
        "glass-control relative",
        className,
      )}
      type={type}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  onPointerLeave,
  onPointerMove,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(event);
    updateGlassPosition(event.currentTarget, event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(event);
    event.currentTarget.style.removeProperty("--glass-x");
    event.currentTarget.style.removeProperty("--glass-y");
  };

  return (
    <Link
      className={cn(
        "button",
        `button--${variant}`,
        "glass-control relative",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </Link>
  );
}
