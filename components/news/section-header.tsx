"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { SectionTag, sectionLabels } from "@/components/ui/section-tag";
import { Caption } from "@/components/typography";

type Section = "politics" | "economy" | "society";

const sectionLineColors: Record<Section, string> = {
  politics: "bg-politics",
  economy: "bg-economy",
  society: "bg-society",
};

const sectionHeaderVariants = cva("flex items-center gap-3 mb-6", {
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
        <SectionTag section={section}>{labels.ko}</SectionTag>
        <div
          className={cn("flex-1 h-px", sectionLineColors[section])}
          aria-hidden="true"
        />
        <Caption
          uppercase
          tone="muted"
          size="sm"
          className="tracking-widest"
        >
          {labels.en}
        </Caption>
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader, sectionHeaderVariants };
