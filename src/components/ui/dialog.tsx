import type { Ref, ComponentProps } from "solid-js";
import type { Primitive } from "./types";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

type CreateDialogReturnType = [
  { Root: Primitive<"dialog">; Content: Primitive<"div"> },
  { open: () => void; close: () => void }
];

export function createDialog(): CreateDialogReturnType {
  let dialogRef: Ref<HTMLDialogElement> | undefined;

  const open = () => (dialogRef ? (dialogRef as HTMLDialogElement).showModal() : void 0);

  const close = () => (dialogRef ? (dialogRef as HTMLDialogElement).close() : void 0);

  const Root = (props: ComponentProps<"dialog">) => {
    const [, others] = splitProps(props, ["class"]);

    return (
      <dialog
        class={cn(
          "text-md inset-0 block w-[calc(100vw_-_3rem)] p-6 sm:w-2/3 translate-y-10 rounded-md opacity-0 transition-[opacity,transform] duration-300 backdrop:backdrop-blur-sm [&:not([open])]:pointer-events-none [&[open]]:translate-y-0 [&[open]]:opacity-100",
          props.class
        )}
        ref={dialogRef}
        onClick={(ev) => {
          const target = ev.target as HTMLDialogElement;
          if (target.nodeName === "DIALOG") target.close();
        }}
        {...others}
      />
    );
  };

  const Content: Primitive<"div"> = (props) => {
    const [, others] = splitProps(props, ["class"]);

    return (
      <div class={cn(props.class)} {...others}>
        {props.children}
      </div>
    );
  };

  return [
    { Root, Content },
    { open, close },
  ];
}
