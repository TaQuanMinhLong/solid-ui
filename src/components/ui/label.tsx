import type { ComponentProps } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { splitProps } from "solid-js";
import { cva } from "class-variance-authority";
import { cn } from "~/styles";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

interface LabelProps extends ComponentProps<"label">, VariantProps<typeof labelVariants> {}

export function Label(props: LabelProps) {
  const [, others] = splitProps(props, ["class"]);
  return <label class={cn(labelVariants({ class: props.class }))} {...others} />;
}
