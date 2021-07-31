import { DeepEcomProvider, extendTheme } from "@deepui/react";
import { useState, useMemo } from "react";
import { withPerformance } from "storybook-addon-performance";
import { light, dark, midnight, pale, dawn, bee, cool } from "./themes";

import "./styles.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

const withDeepEcom = (StoryFn: Function) => {
  const [colorScheme, setColorScheme] = useState("light");
  const theme = useMemo(
    () =>
      extendTheme({
        cursor: colorScheme === "light" ? "pointer" : "default",
        colorSchemes: {
          light,
          dark,
          midnight,
          pale,
          dawn,
          bee,
          cool,
        },
      }),
    [colorScheme]
  );

  return (
    <DeepEcomProvider theme={theme} colorScheme={colorScheme}>
      <div
        id="story-wrapper"
        className="space-y-4"
        style={{ minHeight: "100vh" }}
      >
        <div className="flex mb-4 justify-items-end">
          <button
            onClick={() =>
              setColorScheme((prev) => (prev === "light" ? "dark" : "light"))
            }
          >
            Change theme
          </button>
        </div>
        <StoryFn />
      </div>
    </DeepEcomProvider>
  );
};

export const decorators = [withDeepEcom, withPerformance];
