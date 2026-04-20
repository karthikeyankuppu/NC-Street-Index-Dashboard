import { Children, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

/**
 * Plain-Tailwind tooltip. Pure CSS hover (no portal, no Radix).
 *
 * Compat API:
 *   <TooltipProvider>          → no-op wrapper
 *     <Tooltip>                → group container
 *       <TooltipTrigger asChild>{trigger}</TooltipTrigger>
 *       <TooltipContent side="bottom">...</TooltipContent>
 *     </Tooltip>
 *   </TooltipProvider>
 *
 * Tooltip wraps everything in a `group/tt` container; TooltipContent is
 * shown on `group-hover` with a small delay. `side` controls position.
 */

const TooltipProvider = ({ children }) => <>{children}</>;

const Tooltip = ({ children }) => (
  <span className="relative inline-flex group/tt">{children}</span>
);

const TooltipTrigger = ({ asChild, children, ...props }) => {
  if (asChild && isValidElement(children)) {
    return cloneElement(children, { ...props, ...children.props });
  }
  return <span {...props}>{children}</span>;
};

const sideClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const TooltipContent = ({ side = 'top', className, children, ...props }) => (
  <span
    role="tooltip"
    className={cn(
      'pointer-events-none absolute z-50 hidden group-hover/tt:block',
      'rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      sideClasses[side],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
