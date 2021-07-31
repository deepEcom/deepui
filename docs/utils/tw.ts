export const twFile = {
  name: "tailwind.config.js",
  code: `import colors from "tailwindcss/colors";

module.exports = {
  mode: "jit",
  purge: [
    // ...
    "./node_modules/@deepui/**/*.{js,ts,jsx,tsx}", // path to deepui
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
      }
    }
  },
  variants: {
    extend: {},
  },
  // add deepui plugin
  plugins: [
    require("@tailwindcss/forms"),
    require("@deepui/core")({
      colors: ["orange"],
    }),
    // ...
  ],
};`,
  readOnly: true,
};

export const tabsEndClosedTWFile = {
  name: "tailwind.config.js",
  code: `module.exports = {
  mode: "jit",
  purge: [
    // ...
    "./node_modules/@deepui/**/*.{js,ts,jsx,tsx}", // path to deepui
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      borderColor: {
        inherit: "inherit",
      },
    }
  },
  variants: {
    extend: {},
  },
  // add deepui plugin
  plugins: [
    require("@tailwindcss/forms"),
    require("@deepui/core"),
    // ...
  ],
};`,
  readOnly: true,
}