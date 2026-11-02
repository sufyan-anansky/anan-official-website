import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("container-shell", className)} {...props}>
      {children}
    </div>
  );
}
