// @ts-nocheck
import React from "react"
import { Carousel } from "./Carousel"


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

interface Responsive {
  [key: string]: {
    breakpoint: {
      max: number,
      min: number
    },
    items: number
  }
}

export interface WithScrollbarProps {
  responsive?: Responsive
} 

export interface WithScrollbarState {
  additionalTransform: number
}

export class WithScrollbar extends React.Component<WithScrollbarProps, WithScrollbarState> {

  public static defaultProps = {
    responsive
  }

  constructor(props) {
    super(props)
    this.state = { additionalTransfrom: 0 };
  }
  render() {
    const CustomSlider = ({ carouselState }) => {
      let value = 0;
      let carouselItemWidth = 0;
      if (this.Carousel) {
        carouselItemWidth = this.Carousel.state.itemWidth;
        const maxTranslateX = Math.round(
          // so that we don't over-slide
          carouselItemWidth *
            (this.Carousel.state.totalItems -
              this.Carousel.state.slidesToShow) +
            150
        );
        value = maxTranslateX / 100; // calculate the unit of transform for the slider
      } else {
        return null;
      }
      const { transform, deviceType, totalItems } = carouselState;

      const itemLength = this.props.responsive[deviceType].items
      
      // console.log(totalItems, deviceType, itemLength)
      return (
        <div className="carousel-custom-slider">
          <style>{`
          input.carousel-custom-slider__input[type="range"] {
            -webkit-appearance: none;
          }
          
          input.carousel-custom-slider__input[type="range"]::-webkit-slider-runnable-track {
            width: 300px;
            height: 2px;
            background: #ddd;
            border: none;
            border-radius: 3px;
          }
          
          input.carousel-custom-slider__input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            border: none;
            height: 5px;
            width: 15%;
            border-radius: 0%;
            background: #000;
            margin-top: -4px;
          }
          
          input.carousel-custom-slider__input[type="range"]:focus {
            outline: none;
          }
          
          input.carousel-custom-slider__input[type="range"]:focus::-webkit-slider-runnable-track {
            background: #ccc;
          }
          .carousel-container-with-scrollbar {
            padding-left: 100px;
            padding-bottom: 20px;
            overflow: visible !important;
          }
          .carousel-custom-slider {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
          }
          .carousel-custom-slider__input {
            width: ${totalItems <= itemLength ? 0 : '100%'};
          }
          .slider-image-item {
            padding: 20px 0 20px 20px;
          }
          `}</style>
          <input
            type="range"
            value={Math.round(Math.abs(transform) / value)}
            defaultValue={0}
            max={
              (carouselItemWidth *
                (carouselState.totalItems - carouselState.slidesToShow) +
                (this.state.additionalTransfrom === 150 ? 0 : 150)) /
              value
            }
            onChange={(e) => {
              if (this.Carousel.isAnimationAllowed) {
                this.Carousel.isAnimationAllowed = false;
              }
              const nextTransform = e.target.value * value;
              const nextSlide = Math.round(nextTransform / carouselItemWidth);
              if (
                e.target.value == 0 &&
                this.state.additionalTransfrom === 150
              ) {
                this.Carousel.isAnimationAllowed = true;
                this.setState({ additionalTransfrom: 0 });
              }
              this.Carousel.setState({
                transform: -nextTransform, // padding 20px and 5 items.
                currentSlide: nextSlide
              });
            }}
            className="carousel-custom-slider__input"
          />
        </div>
      );
    };
    return (
      <Carousel
        ssr={false}
        ref={(el) => (this.Carousel = el)}
        partialVisbile={false}
        customButtonGroup={<CustomSlider />}
        itemClass="slider-image-item"
        responsive={this.props.responsive}
        containerClass="carousel-container-with-scrollbar"
        // additionalTransfrom={-this.state.additionalTransfrom}
        beforeChange={(nextSlide) => {
          if (nextSlide !== 0 && this.state.additionalTransfrom !== 150) {
            this.setState({ additionalTransfrom: 150 });
          }
          if (nextSlide === 0 && this.state.additionalTransfrom === 150) {
            this.setState({ additionalTransfrom: 0 });
          }
        }}
      >
        {this.props.children}
      </Carousel>
    );
  }
}
