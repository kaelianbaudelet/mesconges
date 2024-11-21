"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "w-4 h-4 text-primary bg-zinc-200 rounded relative my-auto flex-shrink-0 flex",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("h-4 w-4 absolute inset-0 bg-primary rounded")}
    >
      <svg
        className="w-4 h-4 p-0.5"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.2"
          d="M17 5L8 15l-5-4"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
