import type { ComponentProps } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { splitProps } from "solid-js";
import { cva } from "class-variance-authority";
import { cn } from "~/styles";

export const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps extends ComponentProps<"div">, VariantProps<typeof alertVariants> {}

function Alert(props: AlertProps) {
  const [{ variant }, others] = splitProps(props, ["class", "variant"]);
  return <div role="alert" class={cn(alertVariants({ variant }), props.class)} {...others} />;
}

function AlertTitle(props: ComponentProps<"h5">) {
  const [, others] = splitProps(props, ["class"]);
  return <h5 class={cn("mb-1 font-medium leading-none tracking-tight", props.class)} {...others} />;
}

function AlertDescription(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);
  return <div class={cn("text-sm [&_p]:leading-relaxed", props.class)} {...others} />;
}

export { Alert, AlertTitle, AlertDescription };
