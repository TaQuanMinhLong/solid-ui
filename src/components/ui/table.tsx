import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

function Table(props: ComponentProps<"table">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <div class="w-full overflow-auto">
      <table class={cn("w-full caption-bottom text-sm", props.class)} {...others} />
    </div>
  );
}

function TableHeader(props: ComponentProps<"thead">) {
  const [, others] = splitProps(props, ["class"]);
  return <thead class={cn("[&_tr]:border-b", props.class)} {...others} />;
}

function TableBody(props: ComponentProps<"tbody">) {
  const [, others] = splitProps(props, ["class"]);
  return <tbody class={cn("[&_tr:last-child]:border-0", props.class)} {...others} />;
}

function TableFooter(props: ComponentProps<"tfoot">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <tfoot class={cn("bg-primary font-medium text-primary-foreground", props.class)} {...others} />
  );
}

function TableRow(props: ComponentProps<"tr">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <tr
      class={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        props.class
      )}
      {...others}
    />
  );
}

function TableHead(props: ComponentProps<"th">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <th
      class={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        props.class
      )}
      {...others}
    />
  );
}

function TableCell(props: ComponentProps<"td">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <td class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", props.class)} {...others} />
  );
}

function TableCaption(props: ComponentProps<"caption">) {
  const [, others] = splitProps(props, ["class"]);
  return <caption class={cn("mt-4 text-sm text-muted-foreground", props.class)} {...others} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
