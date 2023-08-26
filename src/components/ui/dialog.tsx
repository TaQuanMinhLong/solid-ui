import type { ComponentProps, Setter } from "solid-js";
import { createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/styles";

function Dialog(props: ComponentProps<"dialog">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <dialog
      class={cn(
        "text-md inset-0 w-[calc(100vw_-_3rem)] sm:w-2/3 translate-y-10 rounded-md opacity-0 transition-[opacity,transform] duration-300 backdrop:backdrop-blur-sm [&:not([open])]:pointer-events-none [&[open]]:translate-y-0 [&[open]]:opacity-100 grid max-w-lg gap-4 border bg-backgroundshadow-lg",
        props.class
      )}
      onClick={(ev) => {
        const target = ev.target as HTMLDialogElement;
        if (target.nodeName === "DIALOG") target.close();
      }}
      {...others}
    >
      <div class="p-6">{props.children}</div>
    </dialog>
  );
}

function DialogTitle(props: ComponentProps<"h2">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <h2 class={cn("text-lg font-semibold leading-none tracking-tight", props.class)} {...others}>
      {props.children}
    </h2>
  );
}

function DialogDescription(props: ComponentProps<"p">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <p class={cn("text-sm text-muted-foreground", props.class)} {...others}>
      {props.children}
    </p>
  );
}

function DialogFooter(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", props.class)}
      {...others}
    >
      {props.children}
    </div>
  );
}

type CreateDialogReturnType = [
  Setter<HTMLDialogElement | undefined>,
  { open: () => void; close: () => void }
];

function createDialog(): CreateDialogReturnType {
  const [ref, setRef] = createSignal<HTMLDialogElement>();
  return [
    setRef,
    {
      open: () => ref()?.showModal(),
      close: () => ref()?.close(),
    },
  ];
}

export { Dialog, DialogTitle, DialogFooter, DialogDescription, createDialog };
