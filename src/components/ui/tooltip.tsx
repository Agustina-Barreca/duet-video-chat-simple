
import React, { useState, useCallback } from 'react';

interface TooltipProps {
  text?: string;
  position?: 'bottom' | 'top' | 'left' | 'right';
  children: React.ReactNode;
}

const Tooltip = React.memo(({ text, position = 'top', children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  // If no text is provided, just render children (for shadcn/ui compatibility)
  if (!text) {
    return <>{children}</>;
  }

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute' as const,
    backgroundColor: 'black',
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
    zIndex: 1000,
    ...(position === 'bottom' && { top: '75%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px' }),
    ...(position === 'top' && { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '16px' }),
    ...(position === 'left' && { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '12px' }),
    ...(position === 'right' && { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '12px' })
  }

  const arrowStyle: React.CSSProperties = {
    position: 'absolute' as const,
    width: '0',
    height: '0',
    borderStyle: 'solid' as const,
    ...(position === 'bottom' && { bottom: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '0 6px 6px 6px', borderColor: 'transparent transparent black transparent' }),
    ...(position === 'top' && { top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '6px 6px 0 6px', borderColor: 'black transparent transparent transparent' }),
    ...(position === 'left' && { left: '100%', top: '50%', transform: 'translateY(-50%)', borderWidth: '6px 0 6px 6px', borderColor: 'transparent transparent transparent black' }),
    ...(position === 'right' && { right: '100%', top: '50%', transform: 'translateY(-50%)', borderWidth: '6px 6px 6px 0', borderColor: 'transparent black transparent transparent' })
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className='zoom-tooltip-text' style={tooltipStyle}>
          {text}
          <div style={arrowStyle} />
        </div>
      )}
    </div>
  )
})

Tooltip.displayName = 'Tooltip'

// Componentes compatibles con shadcn/ui
interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>;

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const TooltipTrigger = ({ children }: TooltipTriggerProps) => <>{children}</>;

interface TooltipContentProps {
  children: React.ReactNode;
  side?: string;
  align?: string;
  hidden?: boolean;
}

const TooltipContent = ({ children }: TooltipContentProps) => <>{children}</>;

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };
