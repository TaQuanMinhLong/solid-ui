import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/styles";

export function Skeleton(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);
  return <div class={cn("animate-pulse rounded-md bg-muted", props.class)} {...others} />;
}
