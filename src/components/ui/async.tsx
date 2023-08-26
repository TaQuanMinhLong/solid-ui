import type { Component, JSXElement } from "solid-js";

import {
  createResource,
  createComputed,
  ErrorBoundary,
  Suspense,
  children,
  Show,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";

export const getSlots = (_children: JSXElement) => {
  const parts = children(() => _children);
  const [slots, setSlots] = createStore<Record<string, JSXElement>>({});
  createComputed(
    on(parts, () => {
      for (const part of parts.toArray() as unknown as SlotProps[]) {
        if (!part.name) {
          setSlots("default", () => part as unknown as JSXElement);
          continue;
        }
        setSlots(part.name, () => part.children);
      }
    })
  );
  return slots;
};

interface SlotProps {
  name: string;
  children: JSXElement;
}

export const Slot: Component<SlotProps> = (props) => {
  return props as unknown as JSXElement;
};

interface AsyncProps<T> {
  promise: Promise<T>;
  children: JSXElement | ((data: T) => JSXElement);
}

/**
 * @example
 *  interface Pokemon {
 *      name: string
 *  }
 *  export default function App() {
 *    const getPokemon = async (name: string): Promise<Pokemon> =>
 *      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => res.json())
 *      return (
 *        <Async promise={getPokemon('ditto')}>
 *          <Await>Loading...</Await>
 * 	        <Catch>Error :(</Catch>
 *          {(pokemon) => pokemon.name}
 *        </Async>
 * 	    )
 *  }
 */
export const Async: <T>(props: AsyncProps<T>) => JSXElement = <T,>(props: AsyncProps<T>) => {
  const slots = getSlots(props.children as unknown as JSXElement);
  const then = slots.default as unknown as (data: T) => JSXElement;
  const [data] = createResource(
    () => props.promise,
    () => props.promise
  );

  return (
    <Suspense fallback={slots.await}>
      <ErrorBoundary fallback={slots.catch}>
        <Show when={data()}>{then(data()!)}</Show>
      </ErrorBoundary>
    </Suspense>
  );
};

export const Await: Component<{ children: JSXElement }> = (props) => {
  return <Slot name="await">{props.children}</Slot>;
};

export const Catch: Component<{ children: JSXElement }> = (props) => {
  return <Slot name="catch">{props.children}</Slot>;
};
