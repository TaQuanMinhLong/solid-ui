import type { Component, ComponentProps, JSXElement } from "solid-js";
import { createSignal, children, For, splitProps, createMemo } from "solid-js";
import { cn } from "~/styles";

interface TabProps extends ComponentProps<"button"> {
  title: string;
}
export const Tab: Component<TabProps> = (props) => {
  return props as unknown as JSXElement;
};

interface TabsProps extends ComponentProps<"ul"> {
  defaultIndex?: number;
  rootProps?: ComponentProps<"div">;
  tabContentClass?: ComponentProps<"div">["class"];
}

export function Tabs(props: TabsProps) {
  const [{ rootProps, defaultIndex, tabContentClass }, others] = splitProps(props, [
    "rootProps",
    "defaultIndex",
    "tabContentClass",
  ]);
  const [activeTab, setActiveTab] = createSignal<number>(defaultIndex || 0);
  const tabs = children(() => props.children);
  const evaluatedTabs = () => tabs.toArray() as unknown as TabProps[];

  return (
    <div {...rootProps}>
      <ul
        {...others}
        class={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
          props.class
        )}
      >
        <For each={evaluatedTabs()}>
          {(props, index) => {
            const [{ title }, others] = splitProps(props, ["title", "class", "onClick"]);
            const isActive = createMemo(() => activeTab() === index());
            return (
              <li role="presentation">
                <button
                  data-state={isActive() ? "active" : "inactive"}
                  data-disabled={props.disabled}
                  aria-selected={isActive()}
                  onClick={() => setActiveTab(index())}
                  class={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                    props.class
                  )}
                  role="tab"
                  {...others}
                >
                  {title}
                </button>
              </li>
            );
          }}
        </For>
      </ul>
      <div
        class={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          tabContentClass
        )}
      >
        {evaluatedTabs()[activeTab()].children}
      </div>
    </div>
  );
}
