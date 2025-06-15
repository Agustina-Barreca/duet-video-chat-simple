
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-xl border border-gray-700",
      "animate-in fade-in-0 zoom-in-95 duration-200",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "before:absolute before:w-0 before:h-0",
      "data-[side=top]:before:bottom-[-4px] data-[side=top]:before:left-1/2 data-[side=top]:before:transform data-[side=top]:before:-translate-x-1/2 data-[side=top]:before:border-l-4 data-[side=top]:before:border-r-4 data-[side=top]:before:border-t-4 data-[side=top]:before:border-transparent data-[side=top]:before:border-t-gray-900",
      "data-[side=bottom]:before:top-[-4px] data-[side=bottom]:before:left-1/2 data-[side=bottom]:before:transform data-[side=bottom]:before:-translate-x-1/2 data-[side=bottom]:before:border-l-4 data-[side=bottom]:before:border-r-4 data-[side=bottom]:before:border-b-4 data-[side=bottom]:before:border-transparent data-[side=bottom]:before:border-b-gray-900",
      "data-[side=left]:before:right-[-4px] data-[side=left]:before:top-1/2 data-[side=left]:before:transform data-[side=left]:before:-translate-y-1/2 data-[side=left]:before:border-t-4 data-[side=left]:before:border-b-4 data-[side=left]:before:border-l-4 data-[side=left]:before:border-transparent data-[side=left]:before:border-l-gray-900",
      "data-[side=right]:before:left-[-4px] data-[side=right]:before:top-1/2 data-[side=right]:before:transform data-[side=right]:before:-translate-y-1/2 data-[side=right]:before:border-t-4 data-[side=right]:before:border-b-4 data-[side=right]:before:border-r-4 data-[side=right]:before:border-transparent data-[side=right]:before:border-r-gray-900",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
