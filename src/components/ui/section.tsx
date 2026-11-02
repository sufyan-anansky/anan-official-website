import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionProps = ComponentPropsWithoutRef<"section">;

export function Section({
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section className={cn("section-shell", className)} {...props}>
      {children}
    </section>
  );
}
