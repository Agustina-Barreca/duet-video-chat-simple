
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 12, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg",
      "animate-in fade-in-0 zoom-in-95 duration-150",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "relative",
      // Piquito para cuando el tooltip está arriba (apunta hacia abajo)
      "data-[side=top]:after:content-[''] data-[side=top]:after:absolute data-[side=top]:after:top-full data-[side=top]:after:left-1/2 data-[side=top]:after:-translate-x-1/2 data-[side=top]:after:border-l-[6px] data-[side=top]:after:border-r-[6px] data-[side=top]:after:border-t-[6px] data-[side=top]:after:border-l-transparent data-[side=top]:after:border-r-transparent data-[side=top]:after:border-t-gray-900",
      // Piquito para cuando el tooltip está abajo (apunta hacia arriba)
      "data-[side=bottom]:after:content-[''] data-[side=bottom]:after:absolute data-[side=bottom]:after:bottom-full data-[side=bottom]:after:left-1/2 data-[side=bottom]:after:-translate-x-1/2 data-[side=bottom]:after:border-l-[6px] data-[side=bottom]:after:border-r-[6px] data-[side=bottom]:after:border-b-[6px] data-[side=bottom]:after:border-l-transparent data-[side=bottom]:after:border-r-transparent data-[side=bottom]:after:border-b-gray-900",
      // Piquito para cuando el tooltip está a la izquierda (apunta hacia la derecha)
      "data-[side=left]:after:content-[''] data-[side=left]:after:absolute data-[side=left]:after:left-full data-[side=left]:after:top-1/2 data-[side=left]:after:-translate-y-1/2 data-[side=left]:after:border-t-[6px] data-[side=left]:after:border-b-[6px] data-[side=left]:after:border-l-[6px] data-[side=left]:after:border-t-transparent data-[side=left]:after:border-b-transparent data-[side=left]:after:border-l-gray-900",
      // Piquito para cuando el tooltip está a la derecha (apunta hacia la izquierda)
      "data-[side=right]:after:content-[''] data-[side=right]:after:absolute data-[side=right]:after:right-full data-[side=right]:after:top-1/2 data-[side=right]:after:-translate-y-1/2 data-[side=right]:after:border-t-[6px] data-[side=right]:after:border-b-[6px] data-[side=right]:after:border-r-[6px] data-[side=right]:after:border-t-transparent data-[side=right]:after:border-b-transparent data-[side=right]:after:border-r-gray-900",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
