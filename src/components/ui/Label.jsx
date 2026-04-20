import { cn } from '@/lib/utils';

/** Plain <label> with Tailwind classes. Forwards htmlFor as `htmlFor`. */
const Label = ({ htmlFor, className, children, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
    {...props}
  >
    {children}
  </label>
);

export { Label };
