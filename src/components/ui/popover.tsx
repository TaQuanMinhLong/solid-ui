import type { ComponentProps } from "solid-js";
import {
  createUniqueId,
  createContext,
  splitProps,
  useContext,
  onMount,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
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
};

type PopoverStore = {
  id: string;
  offset: number;
  state: PopoverState;
  triggerRect?: DOMRect;
};

/**
 * Create a popover context
 *
 * @default id = createUniqueId(), offset = 8
 */
function createPopover({ id = createUniqueId(), offset = 8 }: CreatePopoverOptions = {}) {
  const [store, setStore] = createStore<PopoverStore>({ id, offset, state: "closed" });

  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();

  return {
    setContentRef,
    show: () => contentRef()?.showPopover(),
    toggle: () => contentRef()?.togglePopover(),
    hide: () => contentRef()?.hidePopover(),
    offset: () => store.offset,
    popoverId: () => store.id,
    popoverState: () => store.state,
    setPopoverState: (state: PopoverState) => setStore("state", state),
    triggerRect: () => store.triggerRect,
    setTriggerRect: (triggerRect: DOMRect) => setStore("triggerRect", triggerRect),
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
  const { popoverId, setTriggerRect } = usePopover();
  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();

  onMount(() => setTriggerRect(triggerRef()!.getBoundingClientRect()));

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
  const [, others] = splitProps(props, ["class"]);
  const { popoverId, popoverState, setPopoverState, triggerRect, setContentRef, offset } =
    usePopover();
  const handleToggle = (e: ToggleEvent) => setPopoverState(e.newState);
  return (
    <div
      ref={setContentRef}
      role="dialog"
      tabIndex={-1}
      class={cn(
        "absolute m-0 transition-[opacity,transform] duration-200 data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-1 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=closed]:scale-100 bg-input",
        props.class
      )}
      style={
        popoverState() === "open"
          ? {
              top: `${triggerRect()!.y + triggerRect()!.height + offset()}px`,
              left: `${triggerRect()!.x}px`,
            }
          : undefined
      }
      data-state={popoverState()}
      onToggle={handleToggle}
      id={popoverId()}
      popover
      {...others}
    >
      {props.children}
    </div>
  );
}

export const Popover = {
  Root,
  Content,
  Trigger,
};
export { createPopover };
