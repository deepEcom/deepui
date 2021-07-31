import { DefaultProps } from "@deepui/theme";
import { cx, __DEV__ } from "@deepui/utils";
import * as React from "react";

interface IFormHelperTextProps extends DefaultProps {
  children?: React.ReactNode;
}

export interface FormHelperTextProps
  extends React.HTMLAttributes<HTMLDivElement>,
    IFormHelperTextProps {}

export const FormHelperText = React.forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>((props, ref) => {
  const { className, ...rest } = props;
  const classes = cx("form-helper-text", className);

  return <p ref={ref} className={classes} {...rest} />;
});

if (__DEV__) {
  FormHelperText.displayName = "FormHelperText";
}
