import * as React from "react";

import {
  CarouselInternalState,
  CarouselProps,
  SkipCallbackOptions
} from "./types";
import { getInitialState, getIfSlideIsVisbile } from "./utils";

interface CarouselItemsProps {
  props: CarouselProps;
  state: CarouselInternalState;
  clones: any[];
  notEnoughChildren: boolean;
  goToSlide: (index: number, skipCallbacks?: SkipCallbackOptions) => void;
}

const CarouselItems = ({
  props,
  state,
  goToSlide,
  clones,
  notEnoughChildren
}: CarouselItemsProps) => {
  const { itemWidth } = state;
  const {
    children,
    infinite,
    itemClass,
    itemAriaLabel,
    partialVisible
  } = props;
  const {
    flexBisis,
    shouldRenderOnSSR,
    domFullyLoaded,
    partialVisibilityGutter,
    shouldRenderAtAll
  } = getInitialState(state, props);
  if (!shouldRenderAtAll) {
    return null;
  }

  return (
    <>
      {(infinite ? clones : React.Children.toArray(children)).map(
        (child, index) => {
          return (
            <li
              key={index}
              data-index={index}
              onClick={() => {
                if (props.focusOnSelect) {
                  goToSlide(index);
                }
              }}
              aria-hidden={getIfSlideIsVisbile(index, state) ? "false" : "true"}
              aria-label={
                itemAriaLabel
                  ? itemAriaLabel
                  : child.props.ariaLabel
                  ? child.props.ariaLabel
                  : null
              }
              style={{
                flex: shouldRenderOnSSR ? `1 0 ${flexBisis}%` : "auto",
                position: "relative",
                width: domFullyLoaded
                  ? `${
                      // old wrongly spelt partialVisbile prop kept to not make changes breaking
                      (partialVisible) &&
                      partialVisibilityGutter &&
                      !notEnoughChildren
                        ? itemWidth - partialVisibilityGutter
                        : itemWidth
                    }px`
                  : "auto"
              }}
              className={`react-multi-carousel-item ${
                getIfSlideIsVisbile(index, state)
                  ? "react-multi-carousel-item--active"
                  : ""
              } ${itemClass}`}
            >
              {child}
            </li>
          );
        }
      )}
    </>
  );
};

export default CarouselItems;
