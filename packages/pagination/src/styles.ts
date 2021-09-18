import { cx } from "@deepui/utils";
import { createMemoClass } from "@deepui/theme";

const variants = {
  solid: "pagination-solid",
  outline: "pagination-outline",
  light: "pagination-light",
};

const sizes = {
  sm: "pagination-sm",
  md: "pagination-md",
  lg: "pagination-lg",
  xl: "pagination-xl",
};

export const usePaginationClass = createMemoClass((props) => {
  return cx("pagination", sizes[props.size], variants[props.variant]);
});
