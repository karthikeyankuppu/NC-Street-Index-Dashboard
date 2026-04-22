import { cloneElement, createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TooltipCtx = createContext({ delay: 150 });

export const TooltipProvider = ({ delayDuration = 150, children }) => (
  <TooltipCtx.Provider value={{ delay: delayDuration }}>{children}</TooltipCtx.Provider>
);

const InnerCtx = createContext(null);

export const Tooltip = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <InnerCtx.Provider value={{ open, setOpen }}>
      <span className="relative inline-flex">{children}</span>
    </InnerCtx.Provider>
  );
};

export const TooltipTrigger = ({ asChild, children }) => {
  const { setOpen } = useContext(InnerCtx);
  const handlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };
  if (asChild && children?.type) {
    return cloneElement(children, handlers);
  }
  return <span {...handlers}>{children}</span>;
};

export const TooltipContent = ({ side = 'bottom', className, children }) => {
  const { open } = useContext(InnerCtx);
  if (!open) return null;
  const sideClasses = {
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  return (
    <div
      role="tooltip"
      className={cn(
        'absolute z-[2000] rounded-md border border-border bg-popover text-popover-foreground px-3 py-2 text-xs shadow-md',
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
};
