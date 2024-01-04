import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/styles";

export function IconCheck(props: ComponentProps<"svg">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      height="1em"
      width="1em"
      class={cn("w-4 h-4", props.class)}
      {...others}
    >
      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z" />
    </svg>
  );
}
