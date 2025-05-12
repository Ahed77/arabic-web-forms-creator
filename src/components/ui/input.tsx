
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onChange, ...props }, ref) => {
    // Custom onChange handler to remove leading zeros
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // If it's a number input and has a leading zero followed by another digit, remove the zero
      if (type === 'number' && e.target.value.startsWith('0') && e.target.value.length > 1) {
        e.target.value = e.target.value.replace(/^0+/, '');
      }
      
      // Call the original onChange handler if provided
      if (onChange) {
        onChange(e);
      }
    };
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
