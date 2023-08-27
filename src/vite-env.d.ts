/// <reference types="vite/client" />

/**
 * The ToggleEvent interface represents an event notifying the user when a popover element's state toggles between showing and hidden.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent)
 */
interface ToggleEvent extends Event {
  readonly newState: "open" | "closed";
  readonly oldState: "open" | "closed";
}

interface HTMLElement {
  showPopover: () => void;
  hidePopover: () => void;
  togglePopover: () => void;
}

declare global {
  module "solid-js" {
    namespace JSX {
      interface HTMLAttributes<T> {
        popover?: "auto" | "manual" | true;
      }
      interface PopoverControlAttribute {
        popovertarget?: string;
        popovertargetaction?: "hide" | "show" | "toggle";
      }
      interface InputHTMLAttributes<T> extends PopoverControlAttribute {}
      interface ButtonHTMLAttributes<T> extends PopoverControlAttribute {}
      interface CustomEventHandlersCamelCase<T> {
        onToggle?: EventHandlerUnion<T, ToggleEvent>;
      }
      interface CustomEventHandlersLowerCase<T> {
        ontoggle?: EventHandlerUnion<T, ToggleEvent>;
      }
    }
  }
}
