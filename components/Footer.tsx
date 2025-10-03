"use client";

import { useState, useEffect } from "react";
import AnimatedButton from "./AnimatedButton";
import { usePathname } from "next/navigation";

type FooterProps = {
  ctas?: { label: string; href: string }[];
};

// Move defaultCTAs outside to make it stable
const defaultCTAs = [
  { label: "Check my projects", href: "/projects" },
  { label: "Contact me", href: "/contact" },
  { label: "Check my certificates", href: "/certifications" },
  { label: "Get to know about me", href: "/about" },
  { label: "View dashboard", href: "/dashboard" },
  { label: "Feel free to drop your opinion here", href: "/chat" },
];

export default function Footer({ ctas }: FooterProps) {
  const pathname = usePathname();
  const [displayCTAs, setDisplayCTAs] = useState<typeof defaultCTAs>([]);

  useEffect(() => {
    const allCTAs = ctas || defaultCTAs;

    // Exclude current page
    const filtered = allCTAs.filter((cta) => cta.href !== pathname);

    // Pick 2 random CTAs
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setDisplayCTAs(shuffled.slice(0, 2));
  }, [pathname, ctas]); // only run when pathname or ctas changes

  return (
    <footer className="mt-12 border-t border-[#FFD700] py-8">
      <div className="md:ml-64 md:mr-10 px-4 md:px-12 lg:px-16 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayCTAs.map((cta) => (
            <AnimatedButton
              key={cta.label}
              label={cta.label}
              href={cta.href}
              className="w-full" // Full width in both mobile and desktop columns
            />
          ))}
        </div>

        {/* Copyright text for mobile view, hidden on desktop (md:hidden) */}
        <div className="md:hidden pt-8 text-center text-sm text-white">
          <p>
            © {new Date().getFullYear()} Christian Luis Aceron. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}