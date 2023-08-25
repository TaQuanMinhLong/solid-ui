import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

export function IconReset(props: ComponentProps<"svg">) {
  const [, others] = splitProps(props, ["class"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      stroke-width="0"
      height="1em"
      width="1em"
      class={cn("w-4 h-4", props.class)}
      {...others}
    >
      <path d="M16 6h-6l2.243-2.243C11.11 2.624 9.603 2 8 2s-3.109.624-4.243 1.757C2.624 4.89 2 6.397 2 8s.624 3.109 1.757 4.243C4.89 13.376 6.397 14 8 14a5.963 5.963 0 0 0 4.516-2.049l1.505 1.317a8 8 0 1 1-.364-10.924L16 0v6z" />
    </svg>
  );
}
