"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const sectionTagVariants = cva(
  "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium font-[family-name:var(--font-body)] rounded-md transition-all duration-200",
  {
    variants: {
      section: {
        politics: "bg-politics/20 text-politics border border-politics/30",
        economy: "bg-economy/20 text-economy border border-economy/30",
        society: "bg-society/20 text-society border border-society/30",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      section: "politics",
      size: "default",
    },
  }
);

const sectionLabels: Record<string, { ko: string; en: string }> = {
  politics: { ko: "정치", en: "POLITICS" },
  economy: { ko: "경제", en: "ECONOMY" },
  society: { ko: "사회", en: "SOCIETY" },
};

export interface SectionTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof sectionTagVariants> {
  asChild?: boolean;
  showLabel?: boolean;
}

const SectionTag = React.forwardRef<HTMLSpanElement, SectionTagProps>(
  (
    { className, section = "politics", size, asChild = false, showLabel = true, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";
    const label = section ? sectionLabels[section]?.ko : "";

    return (
      <Comp
        ref={ref}
        data-slot="section-tag"
        data-section={section}
        className={cn(sectionTagVariants({ section, size }), className)}
        {...props}
      >
        {showLabel ? (children ?? label) : children}
      </Comp>
    );
  }
);
SectionTag.displayName = "SectionTag";

export { SectionTag, sectionTagVariants, sectionLabels };
