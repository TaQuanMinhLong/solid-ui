import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/styles";

interface InputProps extends ComponentProps<"input"> {}

export function Input(props: InputProps) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <input
      class={cn(
        "flex h-10 w-full invalid:text-destructive invalid:border-destructive rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 invalid:focus-visible:ring-destructive focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      {...others}
    />
  );
}
