import { createSignal, type Accessor, type Setter } from "solid-js";

type CreateUncontrolledOptions<T> = {
  getter?: Accessor<T>;
  setter?: Setter<T>;
  defaultValue?: T;
  finalValue: T;
};

type UncontrolledSignal<T> = [Accessor<T>, Setter<T>];

export function createUncontrolled<T>({
  defaultValue,
  finalValue,
  setter,
  getter,
}: CreateUncontrolledOptions<T>): UncontrolledSignal<T> {
  const [internalGetter, internalSetter] = createSignal<T>(
    typeof defaultValue !== "undefined" ? defaultValue : finalValue
  );
  return [getter || internalGetter, setter || internalSetter];
}
