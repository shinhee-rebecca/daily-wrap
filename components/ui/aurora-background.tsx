"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("aurora-bg", className)}
        aria-hidden="true"
        {...props}
      >
        {/* Main gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />

        {/* Animated orbs */}
        <div
          className="aurora-orb"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, var(--politics-glow) 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
            animationDelay: "0s",
          }}
        />
        <div
          className="aurora-orb"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, var(--economy-glow) 0%, transparent 70%)",
            top: "30%",
            right: "-15%",
            animationDelay: "-7s",
          }}
        />
        <div
          className="aurora-orb"
          style={{
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, var(--society-glow) 0%, transparent 70%)",
            bottom: "-20%",
            left: "20%",
            animationDelay: "-14s",
          }}
        />
        <div
          className="aurora-orb"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)",
            top: "60%",
            left: "-5%",
            animationDelay: "-3s",
          }}
        />

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-bg-primary/40" />
      </div>
    );
  }
);
AuroraBackground.displayName = "AuroraBackground";

export { AuroraBackground };
