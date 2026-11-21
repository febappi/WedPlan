import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-none rounded-(--radius-pill) border border-input bg-card px-3 py-2 text-md text-ink transition-[border-color] duration-(--dur-short) outline-none placeholder:text-ink-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
