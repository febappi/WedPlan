import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-(--radius-stock) border-0 bg-clip-padding text-sm font-semibold whitespace-nowrap outline-none select-none [--edge:4px] transition-[translate,box-shadow,background-color,color] duration-(--dur-micro) ease-(--ease-snap) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:outline-2 aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[image:var(--grain),var(--fibre)] bg-pear text-pear-ink shadow-[0_var(--edge)_0_0_var(--color-pear-deep)] ease-(--ease-spring) hover:-translate-y-0.5 hover:[--edge:6px] active:translate-y-1 active:[--edge:1px]",
        outline:
          "bg-[image:var(--grain),var(--fibre)] bg-stock text-ink shadow-[inset_0_0_0_1px_var(--color-rule),0_var(--edge)_0_0_var(--color-edge)] hover:-translate-y-0.5 hover:[--edge:6px] active:translate-y-1 active:[--edge:1px] aria-expanded:translate-y-1 aria-expanded:[--edge:1px]",
        secondary:
          "bg-paper-3 text-ink-2 hover:bg-edge/60 aria-expanded:bg-edge/60",
        ghost:
          "text-ink hover:bg-paper-3 aria-expanded:bg-paper-3",
        destructive:
          "bg-[image:var(--grain),var(--fibre)] bg-stock text-error shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-error)_45%,transparent),0_var(--edge)_0_0_color-mix(in_oklab,var(--color-error)_35%,transparent)] hover:-translate-y-0.5 hover:[--edge:6px] active:translate-y-1 active:[--edge:1px]",
        link: "text-blue underline decoration-2 decoration-blue/45 underline-offset-4 hover:decoration-blue",
      },
      size: {
        default:
          "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 rounded-[10px] px-2.5 text-xs [--edge:2px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[12px] px-3.5 [--edge:3px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-13 gap-2 px-6 text-md [--edge:5px] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11",
        "icon-xs": "size-7 rounded-[10px] [--edge:2px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-[12px] [--edge:3px]",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
