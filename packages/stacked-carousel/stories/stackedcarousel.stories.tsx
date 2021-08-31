import { useRef } from "react"
import { StackedCarousel, StackedCarouselHandle } from "../src";

export default {
  title: "StackedCarousel",
  component: StackedCarousel,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const basic = () => {
  const carouseRef: React.ForwardedRef<StackedCarouselHandle> = useRef()
  return (
    <div className="flex space-x-2">
      <button onClick={() => { carouseRef?.current.next() }}>Next</button>
      <button onClick={() => { carouseRef?.current.prev() }}>Prev</button>
      <StackedCarousel ref={carouseRef}>
        <div className="bg-white h-full w-full">ALL Details - Order Ids -1354</div>
        <div className="h-full w-full">World</div>
        <div className="h-full w-full">People</div>
      </StackedCarousel>
    </div>
  );
};

export const autoRotate = () => {
  return (
    <div className="flex space-x-2">
      <StackedCarousel autoRotate>
        <div className="bg-white h-full w-full">ALL Details - Order Ids -1354</div>
        <div className="bg-white h-full w-full">August - Order Ids - 213 , select option for marketplaces</div>
        <div className="bg-white h-full w-full">August - Order Ids - 213 , select option for marketplaces</div>
      </StackedCarousel>
    </div>
  );
};

