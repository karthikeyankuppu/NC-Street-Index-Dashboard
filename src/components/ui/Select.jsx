import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectCtx = createContext(null);

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const [labelMap, setLabelMap] = useState({});
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const registerLabel = (val, label) => {
    setLabelMap(prev => (prev[val] === label ? prev : { ...prev, [val]: label }));
  };

  return (
    <SelectCtx.Provider value={{ value, onValueChange, open, setOpen, labelMap, registerLabel }}>
      <div ref={wrapRef} className="relative">{children}</div>
    </SelectCtx.Provider>
  );
};

export const SelectTrigger = ({ className, children }) => {
  const { open, setOpen } = useContext(SelectCtx);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 ml-1 shrink-0" />
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { value, labelMap } = useContext(SelectCtx);
  const label = value != null ? labelMap[value] : null;
  return <span className="truncate">{label ?? value ?? placeholder}</span>;
};

export const SelectContent = ({ className, children }) => {
  const { open } = useContext(SelectCtx);
  if (!open) return null;
  return (
    <div
      className={cn(
        'absolute z-[2000] mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
        className
      )}
    >
      <div className="p-1 max-h-72 overflow-auto">{children}</div>
    </div>
  );
};

export const SelectItem = ({ value, className, children }) => {
  const { value: selected, onValueChange, setOpen, registerLabel } = useContext(SelectCtx);
  useEffect(() => {
    if (typeof children === 'string') registerLabel(value, children);
    else registerLabel(value, String(children));
  }, [value, children]);
  const isSelected = selected === value;
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => { onValueChange?.(value); setOpen(false); }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-7 pr-2 text-sm outline-none',
        'hover:bg-accent hover:text-accent-foreground',
        className
      )}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      {children}
    </div>
  );
};
