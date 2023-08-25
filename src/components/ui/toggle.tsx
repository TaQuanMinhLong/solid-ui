import type { Accessor, ComponentProps, Setter } from "solid-js";
import { createUncontrolledSignal } from "~/hooks";
import { splitProps } from "solid-js";
import { cn } from "~/lib/styles";

interface ToggleProps extends Omit<ComponentProps<"button">, "onClick"> {
  onCheckedChange?: Setter<boolean>;
  checked?: Accessor<boolean>;
  defaultChecked?: boolean;
}

export function Toggle(props: ToggleProps) {
  const [{ checked, onCheckedChange, defaultChecked }, others] = splitProps(props, [
    "class",
    "checked",
    "onCheckedChange",
    "defaultChecked",
  ]);
  const [isChecked, setIsChecked] = createUncontrolledSignal({
    defaultValue: defaultChecked,
    finalValue: false,
    setter: onCheckedChange,
    getter: checked,
  });

  return (
    <button
      data-state={isChecked() ? "checked" : "unchecked"}
      aria-checked={isChecked()}
      class={cn(
        "peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        props.class
      )}
      onClick={() => setIsChecked(!isChecked())}
      role="switch"
      {...others}
    >
      <span
        data-state={isChecked() ? "checked" : "unchecked"}
        class={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
        )}
      />
    </button>
  );
}
