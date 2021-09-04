const primaryColor = ""
const paginationItemSize = 28;
// const paginationItemBg = "#FFF";
const paginationItemSizeSm = 24;
module.exports = Forms = (colors) => ({
  ".rc-pagination": {
    "@apply m-0 p-0": {
      "ul, ol": {
        "@apply m-0 p-0 list-none": {}
      }
    },

    

    "&::after": {
      display: "block",
      clear: "both",
      height: 0,
      overflow: "hidden",
      visibility: "hidden",
      content: ' '
    },

    "&-total-text": {
      display: "inlint-block",
      height: `${paginationItemSize}px`,
      "margin-right": "8px",
      "line-height": `${paginationItemSize - 2}px`,
      "vertical-align": "middle"
    },

    "&-item": {
      "@apply border border-neutral-200": {},
      display: "inline-block",
      "min-width": `${paginationItemSize}px`,
      height: `${paginationItemSize}px`,
      "margin-right": '8px',
      "line-height": `${paginationItemSize - 2}px`,
      "text-align": "center",
      "vertical-align": "middle",
      "list-style": "none",
      "border-radius": "2px",
      "background-color": "transparent",
      "font-family": "inherit",
      "outline": 0,
      "user-select": "none",
      "@apply cursor-pointer": {
        a: {
          "display": "block",
          "padding": "0 6px",
          "color": "rgba(0, 0, 0, 0.85)",
          "transition": "none",
    
          "&:hover": {
            "text-decoration": "none"
          }
        }
      },
      
      ...colors.reduce(
        (styles, color) => ({
          ...styles,
          [`&[data-color="${color}"]`]: {
            /* focus */
            [`@apply focus:border-${color}-500`]: {},
            [`@apply focus:ring-${color}-500`]: {},
            /* hover */
            [`@apply hover:bg-${color}-50`]: {},
            /* dark hover */
            [`@apply dark:hover:bg-${color}-200`]: {},
            [`@apply dark:hover:bg-opacity-15`]: {},
            /* dark focus */
            [`@apply dark:focus:border-${color}-500`]: {},
            [`@apply dark:focus:ring-${color}-500`]: {},
          },
          [`&[data-active-color="${color}"]`]: {
            [`@apply border-current`]: {},
            [`@apply text-${color}-600 bg-transparent`]: {},
            /* hover */
            [`@apply hover:bg-${color}-50`]: {},
            /* focus */
            [`@apply focus:border-${color}-500`]: {},
            [`@apply focus:ring-${color}-500`]: {},
            /* active */
            [`@apply active:bg-${color}-100`]: {},
            /* dark mode */
            [`@apply dark:border-${color}-200`]: {},
            [`@apply dark:text-${color}-200 dark:bg-transparent`]: {},
            [`@apply dark:border-${color}-300`]: {},
            /* dark hover */
            [`@apply dark:hover:bg-${color}-200`]: {},
            [`@apply dark:hover:bg-opacity-15`]: {},
            /* dark focus */
            [`@apply dark:focus:border-${color}-500`]: {},
            [`@apply dark:focus:ring-${color}-500`]: {},
            /* dark active */
            [`@apply dark:active:bg-${color}-200`]: {},
            [`@apply dark:active:bg-opacity-25`]: {},
          },
        }),
        {}
      )
    },

    "&-jump-prev, &-jump-next": {
      outline: "0",
      button: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#666"
      },

      "button:after": {
        display: "block",
        content: '•••'
      }
    },

  "&-prev, &-jump-prev, &-jump-next": {
    "margin-right": "8px"
  },
  "&-prev, &-next, &-jump-prev, &-jump-next": {
    display: "inline-block",
    "min-width":`${paginationItemSize}px`,
    height: `${paginationItemSize}px`,
    color: "rgba(0, 0, 0, 0.85)",
    "font-family": "inherit",
    "line-height":`${paginationItemSize}px`,
    "text-align": "center",
    "vertical-align": "middle",
    "list-style": "none",
    "border-radius": "2px",
    cursor: "pointer",
    transition: "all 0.3s"
  },

  "&-prev, &-next": {
    outline: 0,

    button: {
      color: "rgba(0, 0, 0, 0.85)",
      cursor: "pointer",
      "user-select": "none"
    },

    "&::hover button": {
      "border-color": "#40a9ff"
    },

    ".rc-pagination-item-link": {
      display: "block",
      width: "100%",
      height: "100%",
      "font-size": "12px",
      "text-align": "center",
      "background-color": "inherit",
      "border-radius": "2px",
      outline: "none",
      transition: "all 0.3s",
      "@apply border border-neutral-200": {},
    },

    "&:focus .rc-pagination-item-link, &:hover .rc-pagination-item-link": {
        // "color": @primary-color;
        // border-color: @primary-color;
        "@apply border border-neutral-200": {},

        ...colors.reduce(
          (styles, color) => ({
            ...styles,
            [`&[data-color="${color}"]`]: {
              /* focus */
              [`@apply focus:border-${color}-500`]: {},
              [`@apply focus:ring-${color}-500`]: {},
              /* hover */
              [`@apply hover:bg-${color}-50`]: {},
              /* dark hover */
              [`@apply dark:hover:bg-${color}-200`]: {},
              [`@apply dark:hover:bg-opacity-15`]: {},
              /* dark focus */
              [`@apply dark:focus:border-${color}-500`]: {},
              [`@apply dark:focus:ring-${color}-500`]: {},
            }
          }),
          {}
        )
      },
    },

    "&-prev": {
      ".rc-pagination-item-link:after": {
        content: '‹',
        display: "block"
      }
    },
    
    "&-next": {
      ".rc-pagination-item-link:after": {
        content: '›',
        display: "block"
      }
    },
    
    "&-disabled": {
      "&, &:hover,&:focus": {
        cursor: "not-allowed",
        ".rc-pagination-item-link": {
          color: "fade(#000, 25%)",
          cursor: "not-allowed",
          "@apply border border-neutral-200": {},
        }
      }
    },
    
    "&-slash": {
      margin: "0 10px 0 5px"
    },
    
    "&-options": {
      display: "inline-block",
      "margin-left": "16px",
      "vertical-align": "middle",
  
      // IE11 css hack. `*::-ms-backdrop,` is a must have
      "@media all and (-ms-high-contrast: none)": {
        "*::-ms-backdrop,&": {
          "vertical-align": "top"
        }
      },
  
      "&-size-changer.rc-select": {
        display: "inline-block",
        width: "auto",
        "margin-right": "8px"
      },
  
      "&-quick-jumper": {
        display: "inline-block",
        height: `${paginationItemSize}px`,
        "line-height": `${paginationItemSize}px`,
        "vertical-align": "top",
  
        "input": {
          width: "50px",
          margin: "0 8px"
        }
      }
    },
    
      "&-simple &-prev, &-simple &-next": {
        height: `${paginationItemSizeSm}px`,
        "line-height": `${paginationItemSizeSm}px`,
        "vertical-align": "top",
        ".rc-pagination-item-link": {
          height: `${paginationItemSizeSm}px`,
          "background-color": "transparent",
          border: 0,
          "&::after": {
            height: `${paginationItemSizeSm}px`,
            "line-height": `${paginationItemSizeSm}px`,
          }
        }
      },
    
      "&-simple &-simple-pager": {
        display: "inline-block",
        height: `${paginationItemSizeSm}px`,
        "margin-right": "8px",
    
        "input": {
          "@apply bg-transparent border border-neutral-200": {},
          "box-sizing": "border-box",
          height: "100%",
          "margin-right": "8px",
          padding: "0 6px",
          "text-align": "center",
          "border-radius": "2px",
          "outline": "none",
          "transition": "border-color 0.3s",
    
          "&:hover": {
            ...colors.reduce(
              (styles, color) => ({
                ...styles,
                [`&[data-color="${color}"]`]: {
                  /* hover */
                  [`@apply hover:bg-${color}-50`]: {},
                  /* dark hover */
                  [`@apply dark:hover:bg-${color}-200`]: {},
                  [`@apply dark:hover:bg-opacity-15`]: {}
                }
              }),
              {}
            )
          }
        }
      },
  // },

  "&-disabled": {
        cursor: "not-allowed",
    
        ".rc-pagination-item": {
          background: "hsv(0, 0, 96%)",
          "@apply border border-neutral-200": {},
          cursor: "not-allowed",
    
          a: {
            color: "fade(#000, 25%)",
            background: "transparent",
            border: "none",
            cursor: "not-allowed"
          },
    
          "&-active": {
            // background: "",
            "@apply bg-white": {},
            "border-color": "transparent",
            "a": {
              color: "#FFF"
            }
          }
        },
    
        ".rc-pagination-item-link": {
          color: "fade(#000, 25%)",
          background: "hsv(0, 0, 96%)",
          // border-color: #d9d9d9;
          "@apply border border-neutral-200": {},
          cursor: "not-allowed"
        },
    
        ".rc-pagination-item-link-icon": {
          opacity: 0
        },
    
        ".rc-pagination-item-ellipsis": {
          opacity: 1
        }
      },

  }
})