import { children, Component, createComputed, JSXElement, on } from "solid-js";
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

/**
 * @example
 *  export const App: Component = () => {
 *      return (
 *          <Section>
 *              <Slot name="header">
 * 	                <h3>My Header</h3>
 *              </Slot>
 * 	            My Content
 *          </Section>
 * 	   )
 *  }
 */
export const Slot: Component<SlotProps> = (props) => {
  return props as unknown as JSXElement;
};
