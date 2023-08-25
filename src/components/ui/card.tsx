import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

function Card(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", props.class)}
      {...others}
    />
  );
}

function CardHeader(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);

  return <div class={cn("flex flex-col space-y-1.5 p-6", props.class)} {...others} />;
}

function CardTitle(props: ComponentProps<"h3">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <h3 class={cn("text-2xl font-semibold leading-none tracking-tight", props.class)} {...others} />
  );
}

function CardDescription(props: ComponentProps<"p">) {
  const [, others] = splitProps(props, ["class"]);
  return <p class={cn("text-sm text-muted-foreground", props.class)} {...others} />;
}

function CardContent(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);
  return <div class={cn("p-6 pt-0", props.class)} {...others} />;
}

function CardFooter(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);
  return <div class={cn("flex items-center p-6 pt-0", props.class)} {...others} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
