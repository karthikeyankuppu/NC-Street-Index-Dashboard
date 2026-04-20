import { Children, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

/**
 * Plain-Tailwind <select> with shadcn-compatible API.
 *
 * Usage:
 *   <Select value={v} onValueChange={setV}>
 *     <SelectTrigger className="..."><SelectValue /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="1">One</SelectItem>
 *     </SelectContent>
 *   </Select>
 *
 * Implementation: SelectContent's children are flattened to find <SelectItem>s,
 * then rendered inside a native <select>. Trigger styles wrap the <select>.
 */

function collectItems(node, out) {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    if (child.type?.__isSelectItem) {
      out.push({ value: child.props.value, label: child.props.children, className: child.props.className });
    } else if (child.props?.children) {
      collectItems(child.props.children, out);
    }
  });
}

const Select = ({ value, onValueChange, defaultValue, children, disabled }) => {
  let triggerProps = {};
  let contentChildren = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type?.__isSelectTrigger) {
      triggerProps = child.props;
    } else if (child.type?.__isSelectContent) {
      contentChildren = child.props.children;
    }
  });

  const items = [];
  collectItems(contentChildren, items);

  const triggerClasses = cn(
    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
    triggerProps.className,
  );

  return (
    <div className="relative inline-block w-full">
      <select
        value={value ?? defaultValue ?? ''}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        className={cn(triggerClasses, 'appearance-none pr-8')}
      >
        {items.map((it) => (
          <option key={it.value} value={it.value} className={it.className}>
            {typeof it.label === 'string' ? it.label : String(it.label ?? it.value)}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-50 text-xs">▾</span>
    </div>
  );
};

const SelectTrigger = ({ children, className, ...props }) => (
  // Marker component — actual rendering happens inside <Select>.
  <div data-select-trigger {...props} className={className}>{children}</div>
);
SelectTrigger.__isSelectTrigger = true;

const SelectValue = ({ placeholder }) => <span>{placeholder ?? ''}</span>;

const SelectContent = ({ children }) => <>{children}</>;
SelectContent.__isSelectContent = true;

const SelectItem = ({ value, children, className }) => (
  // Marker component — collected by parent.
  <option value={value} className={className}>{children}</option>
);
SelectItem.__isSelectItem = true;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
