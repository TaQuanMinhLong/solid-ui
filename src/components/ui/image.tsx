import type { ComponentProps, JSXElement } from "solid-js";
import { Match, Switch, createSignal, onMount, splitProps } from "solid-js";
import { cn } from "~/lib/styles";

interface ImageProps extends ComponentProps<"img"> {
  fallbackWidth?: number;
  fallbackHeight?: number;
  fallback?: JSXElement;
  loadingElement?: JSXElement;
}

type ImageStatus = "idle" | "loading" | "loaded" | "error";

const ImageSkeleton = () => <div class="animate-pulse w-full bg-gray-200/80 h-full duration-700" />;

const ImageError = () => (
  <div class="w-full bg-red-50 px-4 py-2 rounded-md h-full flex items-center justify-center">
    <p class="text-destructive">Error: Cannot load image</p>
  </div>
);

export function Image(props: ImageProps) {
  const [{ fallback, loadingElement, fallbackHeight, fallbackWidth }, others] = splitProps(props, [
    "loadingElement",
    "fallbackHeight",
    "fallbackWidth",
    "fallback",
    "onError",
    "onLoad",
    "class",
  ]);
  const [status, setStatus] = createSignal<ImageStatus>("idle");

  onMount(() => setStatus("loading"));

  return (
    <div
      class="relative"
      style={{
        height: fallbackHeight ? `${fallbackHeight}px` : undefined,
        width: fallbackWidth ? `${fallbackWidth}px` : undefined,
      }}
    >
      <img
        class={cn(
          "relative object-cover transition-opacity duration-300",
          status() === "loaded" ? "opacity-100 z-20" : "opacity-0 -z-10",
          props.class
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        loading="lazy"
        {...others}
      />
      <div class="absolute pointer-events-none transition-opacity duration-300 inset-0 grid">
        <Switch>
          <Match when={status() === "loading"}>{loadingElement || <ImageSkeleton />}</Match>
          <Match when={status() === "error"}>{fallback || <ImageError />}</Match>
        </Switch>
      </div>
    </div>
  );
}
