// import { useRef } from "react"
import { Carousel } from "../src/Carousel";
import { WithScrollbar } from "../src/WithScrollbar";

const texts = [
  "Hello World",
  "Awesome World",
  "Let's rock World",
  "Here we go World",
  "Bye World",
];

const fakerData = Array(8)
  .fill(0)
  .map((item, index) => {
    const number =  Math.floor(Math.random() * 4);
    return {
      headline: "Deep EcomInsight",
      description: texts[number],
    };
  });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      partialVisibilityGutter: 40, // this is optional if you are not using partialVisible props
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      partialVisibilityGutter: 30, // this is optional if you are not using partialVisible props
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      partialVisibilityGutter: 30, // this is optional if you are not using partialVisible props
    },
  };

export default {
  title: "MultiCarousel",
  component: Carousel,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const basic = () => {
  return (
    <Carousel
      deviceType="desktop"
      // infinite={true}
      responsive={responsive}
    >
      {fakerData.map((card, index) => {
        return <div key={index} className="bg-white border" style={{ width: 200, height: 200 }}>{card.description}</div>;
      })}
    </Carousel>
  );
};

export const withScrollBar = () => {
  return (
    <WithScrollbar responsive={responsive}>
        {fakerData.map((card, index) => {
          return <div key={index} className="bg-white border" style={{ width: 200, height: 200 }}>{index} - {card.description}</div>;
        })}
    </WithScrollbar>
  );
};

