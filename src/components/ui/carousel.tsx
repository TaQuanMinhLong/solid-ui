import type { Accessor, ComponentProps } from "solid-js";
import { createContext, createMemo, createSignal, splitProps, useContext } from "solid-js";
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

/**

 */

type CreateCarouselOptions = {
  slideHeight?: number;
  slideMargin?: number;
  initialPosition?: number;
  slideWidth?: number;
};

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
 */
function createCarousel({
  initialPosition = 0,
  slideMargin: _slideMargin = 24,
  slideWidth: _slideWidth = 400,
  slideHeight: _slideHeight = 500,
}: CreateCarouselOptions) {
  const [ref, setRef] = createSignal<HTMLUListElement>();
  const [sliderPosition, setSliderPosition] = createSignal(initialPosition);
  const slideWidth = createMemo(() =>
    typeof window !== "undefined" ? Math.min(_slideWidth, window.innerWidth) : _slideWidth
  );
  const slideMargin = createMemo(() => _slideMargin);
  const slideHeight = createMemo(() => _slideHeight);
  const currentSlide = createMemo(() =>
    Math.floor(sliderPosition() / (slideWidth() + slideMargin()))
  );

  const scrolledToEnd: Accessor<boolean> = () => {
    if (ref()) {
      const value = ref()!.scrollWidth - sliderPosition() - ref()!.clientWidth;
      return value !== 0 && Math.floor(value) === 0;
    }
    return false;
  };

  const handleScroll = (e: ScrollEvent) => setSliderPosition(e.currentTarget.scrollLeft);

  function scrollToSlide(slideIndex: number) {
    ref()?.scrollTo({
      left: slideIndex * (slideWidth() + slideMargin()),
      behavior: "smooth",
    });
  }

  return {
    setRef,
    slideWidth,
    slideMargin,
    slideHeight,
    handleScroll,
    scrolledToEnd,
    currentSlide,
    scrollToSlide,
  };
}

type ScrollEvent = Event & {
  currentTarget: HTMLUListElement;
  target: Element;
};

type CarouselContextObj = ReturnType<typeof createCarousel>;

const CarouselContext = createContext<CarouselContextObj>();

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("Carousel must be used within CarouselRoot");
  return context;
}

interface CarouselRootProps extends ComponentProps<"div"> {
  carousel: CarouselContextObj;
}

function Root(props: CarouselRootProps) {
  const [{ carousel }, others] = splitProps(props, ["carousel", "style", "class"]);
  return (
    <CarouselContext.Provider value={carousel}>
      <div
        style={{ height: `${carousel.slideHeight()}px` }}
        class={cn("overflow-hidden", props.class)}
        ref={carousel.setRef}
        {...others}
      >
        {props.children}
      </div>
    </CarouselContext.Provider>
  );
}

function Slider(props: ComponentProps<"ul">) {
  const [, others] = splitProps(props, ["class", "style", "onScroll", "ref"]);
  const { slideMargin, slideHeight, handleScroll, setRef } = useCarousel();
  return (
    <ul
      class={cn("flex overflow-x-auto snap-x snap-mandatory", props.class)}
      ref={setRef}
      style={{
        height: `${slideHeight() + 40}px`,
        gap: `${slideMargin()}px`,
        "padding-bottom": `${40}px`,
      }}
      onScroll={handleScroll}
      {...others}
    />
  );
}

interface SlideProps extends ComponentProps<"div"> {
  wrapperProps?: ComponentProps<"li">;
  wrapperClass?: string;
}

function Slide(props: SlideProps) {
  const [{ wrapperProps, wrapperClass }, others] = splitProps(props, [
    "class",
    "style",
    "wrapperProps",
    "wrapperClass",
  ]);
  const { slideWidth } = useCarousel();

  return (
    <li class={cn("snap-start snap-always shrink-0", wrapperClass)} {...wrapperProps}>
      <div
        class={cn("slide-center relative bg-white flex flex-col h-full rounded-2xl", props.class)}
        style={{ width: `${slideWidth()}px` }}
        {...others}
      >
        {props.children}
      </div>
    </li>
  );
}
export const Carousel = { Root, Slider, Slide };
export { createCarousel };
