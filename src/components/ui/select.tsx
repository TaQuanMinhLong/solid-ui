import type { Accessor, Setter } from "solid-js";
import { createSignal, createEffect, onCleanup, splitProps, For } from "solid-js";
import { Popover, createPopover } from "./popover";
import { Button, buttonVariants } from "./button";
import { createUncontrolled } from "~/hooks";
import { Label } from "./label";

export type SelectOption = string | { value: string; label: string };

type SelectProps = {
  options: SelectOption[];
  value?: Accessor<string>;
  onChange?: Setter<string>;
  defaultValue?: string;
  id?: string;
};

/**
 * Modify your own version of this component to make muti-select, combobox, autosuggest, ...
 */
export function Select(props: SelectProps) {
  const [{ defaultValue, options }] = splitProps(props, ["defaultValue", "options"]);
  const [value, setValue] = createUncontrolled({
    getter: props.value,
    setter: props.onChange,
    defaultValue,
    finalValue: "",
  });
  const popover = createPopover();

  const [active, setActive] = createSignal(-1);

  function handleKeyDown(e: KeyboardEvent) {
    const maxIndex = options.length - 1;
    const key = e.key as "ArrowDown" | "ArrowUp" | "Enter"; // Just for ts suggesting
    if (key === "ArrowDown") {
      e.preventDefault();
      active() < maxIndex ? setActive((prev) => prev + 1) : setActive(0);
      return;
    }
    if (key === "ArrowUp") {
      e.preventDefault();
      active() > 0 ? setActive((prev) => prev - 1) : setActive(maxIndex);
      return;
    }
  }

  createEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  createEffect(() => {
    const dropdownItems = Array.from(popover.contentRef()?.children || []) as HTMLButtonElement[];
    dropdownItems[active()]?.focus();
  });

  return (
    <Popover.Root ctx={popover}>
      <div class="flex flex-col gap-1">
        <Label for={props.id || popover.triggerId()}>Select grocery</Label>
        <Popover.Trigger
          class={buttonVariants({ variant: "outline", class: "w-[200px]" })}
          id={props.id || popover.triggerId()}
        >
          {value()}
        </Popover.Trigger>
      </div>
      <Popover.Content class="w-[200px] p-1">
        <For each={options}>
          {(item) => (
            <Button
              class="w-full focus:bg-accent focus:text-accent-foreground focus-visible:ring-0"
              onClick={() => setValue(typeof item === "string" ? item : item.value)}
              variant="ghost"
              type="button"
            >
              {typeof item === "string" ? item : item.label}
            </Button>
          )}
        </For>
      </Popover.Content>
    </Popover.Root>
  );
}
