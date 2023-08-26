import type { Component, ComponentProps, ValidComponent } from "solid-js";

export type Primitive<TComponent extends ValidComponent> = Component<ComponentProps<TComponent>>;
