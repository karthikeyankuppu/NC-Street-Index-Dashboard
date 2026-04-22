import { cn } from '@/lib/utils';

export const Label = ({ htmlFor, className, children, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
  >
    {children}
  </label>
);
