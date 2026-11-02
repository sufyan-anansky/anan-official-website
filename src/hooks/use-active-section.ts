"use client";

import { useEffect, useState } from "react";
import { navigationSections } from "@/content/navigation";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>(
    navigationSections[0].id,
  );

  useEffect(() => {
    const sections = navigationSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) setActiveSection(mostVisible.target.id);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return { activeSection, setActiveSection };
}
