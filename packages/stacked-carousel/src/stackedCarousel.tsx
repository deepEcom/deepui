import { DefaultProps } from "@deepui/theme";
import { cx, __DEV__ } from "@deepui/utils";
import React, { useState, useCallback, useEffect, useImperativeHandle } from "react";

export interface Index {
  currentIndex: number
  nextIndex: number
  previousIndex: number
}

export interface StackedCarouselHandle {
  next: () => void,
  prev: () => void
}

export interface StackedCarouselProps
  extends DefaultProps,
    React.HTMLAttributes<HTMLButtonElement> {
  onCardChange?: (indexes: Index) => any;
  containerClassName?: string;
  cardClassName?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
}

const setCardStatus = (indexes: Index, cardIndex: number) => {
  // console.log(indexes, cardIndex);
  if (indexes.currentIndex === cardIndex) {
    return  'active';
  } else if (indexes.nextIndex === cardIndex) {
    return 'next';
  } else if (indexes.previousIndex === cardIndex) {
    return 'prev';
  }
  return 'inactive';
}


export const StackedCarousel = React.forwardRef<StackedCarouselHandle, StackedCarouselProps> ((props, ref) => {
  const {
    onCardChange,
    containerClassName,
    cardClassName,
    autoRotate = false,
    rotationInterval = 2000,
    className,
    children,
    style
  } = props;

  const cardItems = children;

  if (!(cardItems && Array.isArray(cardItems) && cardItems.length)) {
    console.error("Please set cardItems")
    return null
  }

  const [indexes, setIndexes] = useState({
    previousIndex: cardItems.length -1,
    currentIndex: 0,
    nextIndex: 1
  } as Index)

  const handleForwardCardTransition = useCallback(() => {
    // If we've reached the end, start again from the first card,
    // but carry previous value over
    if (indexes.currentIndex >= cardItems.length - 1) {
      setIndexes({
        previousIndex: cardItems.length - 1,
        currentIndex: 0,
        nextIndex: 1
      });
    } else {
      setIndexes(prevState => ({
        previousIndex: prevState.currentIndex,
        currentIndex: prevState.currentIndex + 1 ,
        nextIndex:
          prevState.currentIndex + 2 === cardItems.length
            ? 0
            : prevState.currentIndex + 2
      }));
    }
  }, [indexes.currentIndex]);

  const handleReverseCardTransition = useCallback(() => {
    // If we've reached the end, start again from the first card,
    // but carry previous value over
    if (indexes.currentIndex <= 0) {
      setIndexes({
        previousIndex: cardItems.length - 2,
        currentIndex: cardItems.length - 1,
        nextIndex: 0
      });

    } else {
      setIndexes(prevState => ({
        nextIndex: prevState.currentIndex,
        currentIndex: prevState.currentIndex - 1,
        previousIndex:
          prevState.currentIndex - 1 <= 0
            ? cardItems.length - 1
            : prevState.currentIndex - 2
      }));
    }
  }, [indexes.currentIndex]);


  useImperativeHandle(
    ref,
    () => ({
      next: handleForwardCardTransition,
      prev: handleReverseCardTransition
    })
  )


  useEffect(() => {
    onCardChange && onCardChange(indexes);
    const transitionInterval = setInterval(() => {
      autoRotate && handleForwardCardTransition();
    }, rotationInterval);
    return () => clearInterval(transitionInterval);
  }, [handleForwardCardTransition, indexes, autoRotate]);

  return (
    <>
      <style> {`
        .stackedCarouselcontainer {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: auto;
          padding: 0;
        }
        
        .stackedCarouselCardCarousel {
          list-style: none;
          padding: 0;
          position: relative;
        }
        
        .stackedCarouselDefault {
          width: 300px;
          height: 300px;
          margin: 16px;
        }
             
        .stackedCarouselCard {
          width: 100%;
          height: 100%;
          box-shadow: 0 10px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.5s ease-in-out;
          opacity: 0; 
          position: absolute;
          transform: scale(1) translateX(40px);
        }
        
        .stackedCarouselCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          overflow: hidden;
        }
        
        .stackedCarouselCard.active {
          opacity: 1;
          transform: scale(1) translateY(0);
          z-index: 3;
        }
        
        .stackedCarouselCard.next {
          opacity: 0.6;
          z-index: 2;
          transform: scale(0.9) translateX(40px);
        }
        
        .stackedCarouselCard.prev {
          transform: scale(0.9) translateX(-40px);
          z-index: 1;
          opacity: 0.6;
        }
        
        .stackedCarouselCard.inactive {
          transform: scale(1) translateX(0px);
          z-index: 1;
          opacity: 0;
        }
      `}
      </style>
      <div className="stackedCarouselcontainer">
        <ul className={cx('stackedCarouselCardCarousel', containerClassName ? containerClassName : 'stackedCarouselDefault' )}>
          {cardItems.map((card, index) => (
              <li
                key={`card${index}`}
                className={cx(cardClassName, 'stackedCarouselCard', setCardStatus(indexes, index))}
              >
                { card }
              </li>
            ))}
        </ul>
      </div>
    </>
  )
  
});

if (__DEV__) {
  StackedCarousel.displayName = "StackedCarousel";
}
