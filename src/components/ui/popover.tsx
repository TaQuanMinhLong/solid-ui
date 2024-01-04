import type { ComponentProps } from "solid-js";
import type { Placement } from "@floating-ui/dom";
import {
  createUniqueId,
  createContext,
  createEffect,
  splitProps,
  useContext,
  onCleanup,
} from "solid-js";
import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import { cn } from "~/lib/styles";
import "./popover.css";

type PopoverState = "open" | "closed";

const PopoverContext = createContext<ReturnType<typeof createPopover> | undefined>();

function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover must be used within Popover.Root");
  return context;
}

type CreatePopoverOptions = {
  popoverId?: string;
  triggerId?: string;
  offset?: number;
  placement?: Placement;
};

type PopoverStore = {
  popoverId: string;
  offset: number;
  triggerId: string;
  state: PopoverState;
  placement: Placement;
  triggerRef: HTMLButtonElement | undefined;
  contentRef: HTMLDivElement | undefined;
};

/**
 * Create a popover context
 *
 * @default id = createUniqueId(), offset = 8, placement = "bottom-start"
 */
function createPopover({
  offset = 4,
  popoverId = createUniqueId(),
  placement = "bottom-start",
  triggerId = createUniqueId(),
}: CreatePopoverOptions = {}) {
  const [store, setStore] = createStore<PopoverStore>({
    offset,
    popoverId,
    triggerId,
    placement,
    state: "closed",
    contentRef: undefined,
    triggerRef: undefined,
  });

  return {
    getOffset: () => store.offset,
    placement: () => store.placement,
    show: () => store.contentRef?.showPopover(),
    hide: () => store.contentRef?.hidePopover(),
    toggle: () => store.contentRef?.togglePopover(),
    popoverId: () => store.popoverId,
    triggerId: () => store.triggerId,
    popoverState: () => store.state,
    contentRef: () => store.contentRef,
    triggerRef: () => store.triggerRef,
    handleToggle: (e: ToggleEvent) => setStore("state", e.newState as PopoverState),
    setContentRef: (ref: HTMLDivElement | undefined) => setStore("contentRef", ref),
    setTriggerRef: (ref: HTMLButtonElement | undefined) => setStore("triggerRef", ref),
  };
}

interface PopoverRootProps extends ComponentProps<"div"> {
  ctx: ReturnType<typeof createPopover>;
}

function Root(props: PopoverRootProps) {
  const [, others] = splitProps(props, ["class", "ctx"]);
  return (
    <PopoverContext.Provider value={props.ctx}>
      <div class={cn("relative", props.class)} {...others}>
        {props.children}
      </div>
    </PopoverContext.Provider>
  );
}

function Trigger(props: ComponentProps<"button">) {
  const [, others] = splitProps(props, ["class", "popovertarget", "popovertargetaction", "ref"]);
  const { popoverId, setTriggerRef, triggerId, popoverState } = usePopover();

  return (
    <button
      aria-expanded={popoverState() === "open"}
      class={cn("relative", props.class)}
      popovertargetaction="toggle"
      popovertarget={popoverId()}
      ref={setTriggerRef}
      id={triggerId()}
      role="combobox"
      {...others}
    >
      {props.children}
    </button>
  );
}

/**
 * Set offset by using transform: translate
 */
function Content(props: ComponentProps<"div">) {
  const [, others] = splitProps(props, ["class", "id"]);

  const {
    getOffset,
    popoverId,
    triggerId,
    placement,
    contentRef,
    triggerRef,
    handleToggle,
    setContentRef,
  } = usePopover();

  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  createEffect(() => {
    if (contentRef() && triggerRef()) {
      const cleanUp = autoUpdate(triggerRef()!, contentRef()!, async function () {
        const { x, y } = await computePosition(triggerRef()!, contentRef()!, {
          middleware: [flip(), offset(getOffset()), shift()],
          placement: placement(),
        });
        setPosition({ x, y });
      });
      onCleanup(cleanUp);
    }
  });

  return (
    <div
      ref={setContentRef}
      role="dialog"
      tabIndex={-1}
      class={cn("absolute m-0 p-0 duration-200 bg-background shadow-md rounded-md", props.class)}
      style={{ left: `${position().x}px`, top: `${position().y}px` }}
      onToggle={handleToggle}
      anchor={triggerId()}
      id={popoverId()}
      tabindex={0}
      popover
      {...others}
    >
      {props.children}
    </div>
  );
}

/**
 * Implementation of Popover component using Native Popover API
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
 */
export const Popover = {
  Root,
  Content,
  Trigger,
};
export { createPopover };
