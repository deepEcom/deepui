import { DefaultProps } from "@deepui/theme";
import { cx, __DEV__ } from "@deepui/utils";
import * as React from "react";

import { useFormControl } from "../form-control";

interface IFormLabelProps extends DefaultProps {
  disabled?: boolean;
  children?: React.ReactNode;
  htmlFor?: string;
}

export interface FormLabelProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    IFormLabelProps {}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;
    const formControl = useFormControl(rest);

    const classes = cx(
      "form-label",
      formControl.disabled && "form-label-disabled",
      className
    );

    return (
      <label ref={ref} className={classes} {...rest}>
        {children}
      </label>
    );
  }
);

if (__DEV__) {
  FormLabel.displayName = "FormLabel";
}
