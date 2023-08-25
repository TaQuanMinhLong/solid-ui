import type { Accessor, Component, ComponentProps, Ref } from "solid-js";
import { createMemo, createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/styles";

/*
Add this to your css file before using the component
@layer base {
  :root {
    --container-size: 1200px;
  }
}

@layer utilities {
  .slide-center {
    transform: translateX(
      calc(max(var(--container-size, 100vw) / 2 - calc(var(--container-size) / 2)))
    );
  }
}
*/

type CreateCarouselOptions = {
  slideHeight: number;
  slideMargin: number;
  initialPosition: number;
  slideWidth: number;
};

type CarouselReturn = [
  {
    Root: Component<ComponentProps<"div">>;
    Slider: Component<ComponentProps<"ul">>;
    Slide: Component<ComponentProps<"div">>;
  },
  {
    currentSlide: Accessor<number>;
    sliderPosition: Accessor<number>;
    scrollToSlide: (slideIndex: number) => void;
    scrolledToEnd: () => boolean;
  }
];

/**
 * @default slideMargin = 24, sliderWidth = 400,  initialPosition = 0,
 * @example
 *  <Carousel.Root>
 *    <Carousel.Slider>
 *      <For each={slides}>
 *        {(slide) => (
 *            <Carousel.Slide>
 *              // Your slide goes here
 *            </Carousel.Slide>
 *        )}
 *      </For>
 *    </Carousel.Slider>
 * </Carousel.Root>
 *
 */
export function createCarousel(options?: CreateCarouselOptions): CarouselReturn {
  let sliderRef: Ref<HTMLUListElement> | undefined;

  const { slideMargin, initialPosition, slideWidth, slideHeight }: CreateCarouselOptions =
    options || {
      slideMargin: 24,
      initialPosition: 0,
      slideWidth: 400,
      slideHeight: 500,
    };

  const [sliderPosition, setSliderPosition] = createSignal(initialPosition);

  const getSlideWidth = createMemo(() =>
    typeof window !== "undefined" ? Math.min(slideWidth, window.innerWidth) : slideWidth
  );

  const scrolledToEnd = () => {
    if (sliderRef as HTMLUListElement) {
      const ref = sliderRef as HTMLUListElement;
      const value = ref.scrollWidth - sliderPosition() - ref.clientWidth;
      return value !== 0 && Math.floor(value) === 0;
    }
    return false;
  };

  const getSlideMargin = () => slideMargin;

  const currentSlide = createMemo(() =>
    Math.floor(sliderPosition() / (getSlideWidth() + slideMargin))
  );

  const handleScroll: ComponentProps<"ul">["onScroll"] = (e) => {
    setSliderPosition(e.currentTarget.scrollLeft);
  };

  function scrollToSlide(slideIndex: number) {
    if (sliderRef) {
      (sliderRef as HTMLUListElement).scrollTo({
        left: slideIndex * (getSlideWidth() + slideMargin),
        behavior: "smooth",
      });
    }
  }

  const Root = (props: ComponentProps<"div">) => {
    const [, others] = splitProps(props, ["class", "style"]);

    return (
      <div
        class={cn("overflow-hidden", props.class)}
        style={{ height: `${slideHeight}px` }}
        {...others}
      />
    );
  };

  const Slider = (props: ComponentProps<"ul">) => {
    const [, others] = splitProps(props, ["class", "style"]);

    return (
      <ul
        class={cn("flex overflow-x-auto snap-x snap-mandatory", props.class)}
        style={{
          height: `${slideHeight + 40}px`,
          gap: `${getSlideMargin()}px`,
          "padding-bottom": `${40}px`,
        }}
        onScroll={handleScroll}
        ref={sliderRef}
        {...others}
      />
    );
  };

  interface SlideProps extends ComponentProps<"div"> {
    wrapperProps?: ComponentProps<"li">;
    wrapperClass?: string;
  }

  const Slide = (props: SlideProps) => {
    const [{ wrapperProps, wrapperClass }, others] = splitProps(props, [
      "class",
      "style",
      "children",
      "wrapperProps",
      "wrapperClass",
    ]);

    return (
      <li class={cn("snap-start snap-always shrink-0", wrapperClass)} {...wrapperProps}>
        <div
          class={cn("slide-center relative bg-white flex flex-col h-full rounded-2xl", props.class)}
          style={{ width: `${slideWidth}px` }}
          {...others}
        >
          {props.children}
        </div>
      </li>
    );
  };

  return [
    { Root, Slider, Slide },
    {
      currentSlide,
      scrollToSlide,
      sliderPosition,
      scrolledToEnd,
    },
  ];
}
