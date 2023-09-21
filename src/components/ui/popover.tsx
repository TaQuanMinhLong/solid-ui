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

type PopoverState = "open" | "closed";

const PopoverContext = createContext<ReturnType<typeof createPopover> | undefined>();

function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover must be used within Popover.Root");
  return context;
}

type CreatePopoverOptions = {
  id?: string;
  offset?: number;
  placement?: Placement;
};

type PopoverStore = {
  id: string;
  offset: number;
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
  placement = "bottom-start",
  id = createUniqueId(),
  offset = 8,
}: CreatePopoverOptions = {}) {
  const [store, setStore] = createStore<PopoverStore>({
    id,
    offset,
    placement,
    state: "closed",
    contentRef: undefined,
    triggerRef: undefined,
  });

  return {
    _offset: () => store.offset,
    placement: () => store.placement,
    show: () => store.contentRef?.showPopover(),
    hide: () => store.contentRef?.hidePopover(),
    toggle: () => store.contentRef?.togglePopover(),
    popoverId: () => store.id,
    popoverState: () => store.state,
    contentRef: () => store.contentRef,
    triggerRef: () => store.triggerRef,
    handleToggle: (e: ToggleEvent) => setStore("state", e.newState as PopoverState),
    setContentRef: (ref: HTMLDivElement | undefined) => setStore("contentRef", ref),
    setTriggerRef: (ref: HTMLButtonElement | undefined) => setStore("triggerRef", ref),
  };
}

interface PopoverRootProps extends ComponentProps<"div"> {
  $popover: ReturnType<typeof createPopover>;
}

function Root(props: PopoverRootProps) {
  const [, others] = splitProps(props, ["class", "$popover"]);
  return (
    <PopoverContext.Provider value={props.$popover}>
      <div class={cn("relative", props.class)} {...others}>
        {props.children}
      </div>
    </PopoverContext.Provider>
  );
}

function Trigger(props: ComponentProps<"button">) {
  const [, others] = splitProps(props, ["class", "popovertarget", "popovertargetaction", "ref"]);
  const { popoverId, setTriggerRef } = usePopover();

  return (
    <button
      class={cn("relative", props.class)}
      popovertargetaction="toggle"
      popovertarget={popoverId()}
      ref={setTriggerRef}
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
  const {
    _offset,
    popoverId,
    placement,
    contentRef,
    triggerRef,
    handleToggle,
    popoverState,
    setContentRef,
  } = usePopover();

  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  createEffect(() => {
    if (contentRef() && triggerRef()) {
      const cleanUp = autoUpdate(triggerRef()!, contentRef()!, async function () {
        const { x, y } = await computePosition(triggerRef()!, contentRef()!, {
          middleware: [flip(), offset(_offset()), shift()],
          placement: placement(),
        });
        setPosition({ x, y });
      });
      onCleanup(() => cleanUp());
    }
  });

  return (
    <div
      ref={setContentRef}
      role="dialog"
      tabIndex={-1}
      class="absolute m-0 p-0 transition-[opacity,transform] duration-200 data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-1 data-[state=open]:scale-100 data-[state=closed]:scale-100"
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
      }}
      data-state={popoverState()}
      onToggle={handleToggle}
      id={popoverId()}
      popover
    >
      <div {...props} data-state={popoverState()}>
        {props.children}
      </div>
    </div>
  );
}

export const Popover = {
  Root,
  Content,
  Trigger,
};
export { createPopover };
