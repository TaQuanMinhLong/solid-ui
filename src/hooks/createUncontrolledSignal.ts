import { createSignal, type Accessor, type Setter } from "solid-js";

type CreateUncontrolledSignalOptions<T> = {
  getter?: Accessor<T>;
  setter?: Setter<T>;
  defaultValue?: T;
  finalValue: T;
};

type UncontrolledSignal<T> = [Accessor<T>, Setter<T>];

export function createUncontrolledSignal<T>({
  defaultValue,
  finalValue,
  setter,
  getter,
}: CreateUncontrolledSignalOptions<T>): UncontrolledSignal<T> {
  const [internalGetter, internalSetter] = createSignal<T>(
    typeof defaultValue !== "undefined" ? defaultValue : finalValue
  );
  return [getter || internalGetter, setter || internalSetter];
}
