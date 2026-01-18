"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const dividerVariants = cva("w-full", {
  variants: {
    variant: {
      main: "h-[3px] bg-gradient-to-r from-transparent via-text-primary to-transparent",
      double:
        "h-1 border-t border-b border-text-primary bg-transparent",
      section: "h-px bg-border-editorial",
      dotted: "h-px border-t border-dotted border-text-muted bg-transparent",
    },
    spacing: {
      none: "my-0",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
      xl: "my-8",
      "2xl": "my-12",
    },
  },
  defaultVariants: {
    variant: "section",
    spacing: "lg",
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, variant, spacing, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        data-slot="divider"
        data-variant={variant}
        className={cn(dividerVariants({ variant, spacing }), className)}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";

export { Divider, dividerVariants };
