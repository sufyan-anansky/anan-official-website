import {
  Activity,
  Blocks,
  ChartNoAxesCombined,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const services = [
  {
    id: "workflows",
    icon: Workflow,
    gridClass: "lg:col-span-4",
  },
  {
    id: "platforms",
    icon: Blocks,
    gridClass: "lg:col-span-8",
  },
  {
    id: "data",
    icon: Activity,
    gridClass: "lg:col-span-4",
  },
  {
    id: "analytics",
    icon: ChartNoAxesCombined,
    gridClass: "lg:col-span-4",
  },
  {
    id: "reporting",
    icon: ChartNoAxesCombined,
    gridClass: "lg:col-span-4",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  icon: LucideIcon;
  gridClass: string;
}>;
