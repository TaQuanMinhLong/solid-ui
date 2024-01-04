import type { ComponentProps, Setter } from "solid-js";
import { createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/styles";

export interface DialogProp extends ComponentProps<"dialog"> {
  closeOnClickOutside?: boolean;
}

/**
 * Implementation of native HTML dialog component for solid-js.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 */
function Dialog(props: DialogProp) {
  const [{ closeOnClickOutside = true }, others] = splitProps(props, [
    "class",
    "closeOnClickOutside",
  ]);
  return (
    <dialog
      class={cn(
        "text-md w-screen mb-0 sm:m-auto p-6 sm:w-2/3 rounded-md backdrop:backdrop-blur-sm [&:not([open])]:pointer-events-none grid max-w-lg gap-6 border bg-background shadow-lg",
        props.class
      )}
      onClick={function (ev) {
        if (closeOnClickOutside) {
          const target = ev.target as HTMLDialogElement;
          if (target.nodeName === "DIALOG") target.close();
        }
      }}
      {...others}
    >
      {props.children}
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
  return [setRef, { open: () => ref()?.showModal(), close: () => ref()?.close() }];
}

export { Dialog, DialogTitle, DialogFooter, DialogDescription, createDialog };
