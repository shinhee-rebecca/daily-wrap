"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { SectionTag, sectionLabels } from "@/components/ui/section-tag";
import { Caption } from "@/components/typography";

type Section = "politics" | "economy" | "society";

const sectionGlowColors: Record<Section, string> = {
  politics: "shadow-[0_0_12px_rgba(255,77,109,0.3)]",
  economy: "shadow-[0_0_12px_rgba(0,212,170,0.3)]",
  society: "shadow-[0_0_12px_rgba(255,179,71,0.3)]",
};

const sectionLineColors: Record<Section, string> = {
  politics: "from-politics/60 via-politics/20 to-transparent",
  economy: "from-economy/60 via-economy/20 to-transparent",
  society: "from-society/60 via-society/20 to-transparent",
};

const sectionHeaderVariants = cva("flex items-center gap-4 mb-6", {
  variants: {
    size: {
      default: "",
      sm: "mb-4",
      lg: "mb-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeaderVariants> {
  section: Section;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, section, size, ...props }, ref) => {
    const labels = sectionLabels[section];

    return (
      <div
        ref={ref}
        data-slot="section-header"
        data-section={section}
        className={cn(sectionHeaderVariants({ size }), className)}
        {...props}
      >
        <div className={cn("rounded-lg", sectionGlowColors[section])}>
          <SectionTag section={section}>{labels.ko}</SectionTag>
        </div>
        <div
          className={cn(
            "flex-1 h-px bg-gradient-to-r",
            sectionLineColors[section]
          )}
          aria-hidden="true"
        />
        <Caption
          uppercase
          tone="muted"
          size="sm"
          className="tracking-[0.2em] opacity-50"
        >
          {labels.en}
        </Caption>
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader, sectionHeaderVariants };
