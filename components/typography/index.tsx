"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headlineVariants = cva(
  "font-[family-name:var(--font-headline)] tracking-tight leading-tight",
  {
    variants: {
      size: {
        hero: "text-[2rem] md:text-[3rem] lg:text-[4rem]",
        h1: "text-[1.5rem] md:text-[2rem] lg:text-[2.5rem]",
        h2: "text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem]",
        h3: "text-[1.125rem] md:text-[1.25rem]",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "h1",
      weight: "semibold",
    },
  }
);

type HeadlineElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";

export interface HeadlineProps
  extends VariantProps<typeof headlineVariants> {
  as?: HeadlineElement;
  className?: string;
  children?: React.ReactNode;
}

function Headline({
  className,
  size,
  weight,
  as: Comp = "h1",
  children,
  ...props
}: HeadlineProps & React.ComponentPropsWithoutRef<"h1">) {
  return (
    <Comp
      data-slot="headline"
      className={cn(headlineVariants({ size, weight }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
Headline.displayName = "Headline";

const subheadlineVariants = cva(
  "font-[family-name:var(--font-body)] leading-normal",
  {
    variants: {
      size: {
        lg: "text-[1.125rem] md:text-[1.25rem]",
        default: "text-[1rem] md:text-[1.0625rem]",
        sm: "text-[0.875rem]",
      },
      tone: {
        default: "text-text-primary",
        secondary: "text-text-secondary",
        muted: "text-text-muted",
      },
    },
    defaultVariants: {
      size: "default",
      tone: "secondary",
    },
  }
);

type TextElement = "p" | "span" | "div";

export interface SubheadlineProps
  extends VariantProps<typeof subheadlineVariants> {
  as?: TextElement;
  className?: string;
  children?: React.ReactNode;
}

function Subheadline({
  className,
  size,
  tone,
  as: Comp = "p",
  children,
  ...props
}: SubheadlineProps & React.ComponentPropsWithoutRef<"p">) {
  return (
    <Comp
      data-slot="subheadline"
      className={cn(subheadlineVariants({ size, tone }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
Subheadline.displayName = "Subheadline";

const bodyTextVariants = cva(
  "font-[family-name:var(--font-body)] leading-relaxed",
  {
    variants: {
      size: {
        lg: "text-[1.125rem]",
        default: "text-[1.0625rem]",
        sm: "text-[0.875rem]",
      },
      tone: {
        default: "text-text-primary",
        secondary: "text-text-secondary",
        muted: "text-text-muted",
      },
    },
    defaultVariants: {
      size: "default",
      tone: "default",
    },
  }
);

export interface BodyTextProps
  extends VariantProps<typeof bodyTextVariants> {
  as?: TextElement;
  className?: string;
  children?: React.ReactNode;
}

function BodyText({
  className,
  size,
  tone,
  as: Comp = "p",
  children,
  ...props
}: BodyTextProps & React.ComponentPropsWithoutRef<"p">) {
  return (
    <Comp
      data-slot="body-text"
      className={cn(bodyTextVariants({ size, tone }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
BodyText.displayName = "BodyText";

const captionVariants = cva(
  "font-[family-name:var(--font-display)] tracking-wide",
  {
    variants: {
      size: {
        default: "text-[0.875rem]",
        sm: "text-[0.75rem]",
      },
      tone: {
        default: "text-text-secondary",
        muted: "text-text-muted",
        link: "text-link hover:underline",
      },
      uppercase: {
        true: "uppercase",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      tone: "default",
      uppercase: false,
    },
  }
);

export interface CaptionProps
  extends VariantProps<typeof captionVariants> {
  as?: "span" | "p" | "div";
  className?: string;
  children?: React.ReactNode;
}

function Caption({
  className,
  size,
  tone,
  uppercase,
  as: Comp = "span",
  children,
  ...props
}: CaptionProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <Comp
      data-slot="caption"
      className={cn(captionVariants({ size, tone, uppercase }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
Caption.displayName = "Caption";

const dateDisplayVariants = cva(
  "font-[family-name:var(--font-display)] tracking-normal leading-tight text-text-primary",
  {
    variants: {
      size: {
        hero: "text-[1.5rem] md:text-[2.5rem] lg:text-[3.5rem]",
        lg: "text-[1.25rem] md:text-[1.75rem] lg:text-[2rem]",
        default: "text-[1rem] md:text-[1.25rem]",
        sm: "text-[0.875rem]",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
      },
    },
    defaultVariants: {
      size: "hero",
      weight: "normal",
    },
  }
);

export interface DateDisplayProps
  extends VariantProps<typeof dateDisplayVariants>,
    Omit<React.ComponentPropsWithoutRef<"time">, "dateTime"> {
  dateTime?: string;
}

function DateDisplay({
  className,
  size,
  weight,
  dateTime,
  children,
  ...props
}: DateDisplayProps) {
  return (
    <time
      data-slot="date-display"
      dateTime={dateTime}
      className={cn(dateDisplayVariants({ size, weight }), className)}
      {...props}
    >
      {children}
    </time>
  );
}
DateDisplay.displayName = "DateDisplay";

export {
  Headline,
  headlineVariants,
  Subheadline,
  subheadlineVariants,
  BodyText,
  bodyTextVariants,
  Caption,
  captionVariants,
  DateDisplay,
  dateDisplayVariants,
};
