import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

export function Spinner(props: ComponentProps<"svg">) {
  const [, others] = splitProps(props, ["class"]);

  return (
    <svg
      fill="none"
      stroke-width="2"
      xmlns="http://www.w3.org/2000/svg"
      class={cn("w-4 h-4 animate-spin", props.class)}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...others}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
