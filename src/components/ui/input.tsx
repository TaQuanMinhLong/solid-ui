import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

interface InputProps extends ComponentProps<"input"> {
  isError?: boolean;
}

export function Input(props: InputProps) {
  const [{ isError }, others] = splitProps(props, ["class", "isError"]);
  return (
    <input
      class={cn(
        "flex h-10 w-full text-slate-900 rounded-md border border-slate-800 bg-white px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-slate-950 focus-visible:ring-white",
        { "text-red-500 border-red-500 ring-offset-red-500": isError },
        props.class
      )}
      {...others}
    />
  );
}
