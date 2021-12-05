import * as React from "react";
import { SelectorIcon } from "@deepui/icon";
import { cx } from "@deepui/utils";
import type { AriaSelectProps } from "@react-types/select";
import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing
} from "react-aria";
import { useLayer, mergeRefs } from "react-laag"
import { useSelectState } from "react-stately";

import { ListBox } from "./ListBox";
import { Popover } from "./Popover";


export { Item } from "react-stately";

interface  CustomAriaSelectProps<T> extends  AriaSelectProps<T> {
  layerClassName?: string
  buttonClassName?: string
}

export function SelectBox<T extends object>(props: CustomAriaSelectProps<T>) {
  // Create state based on the incoming props
  let state = useSelectState(props);

  // Get props for child elements from useSelect
  let ref = React.useRef(null);
  let { labelProps, triggerProps: selectTriggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );


  const { triggerProps, layerProps, layerSide } =
    useLayer({
      isOpen: state.isOpen,
      overflowContainer: false,
      auto: true,
      snap: true,
      placement: "bottom-center",
      possiblePlacements: ["top-center", "bottom-center"],
      triggerOffset: 0,
      containerOffset: 16
    })

  // Get props for the button based on the trigger props from useSelect
  let { buttonProps } = useButton(selectTriggerProps, ref);

  let { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div ref={layerProps.ref} className={cx("w-full relative w-52 mt-4", props.layerClassName)}>
      <div
        {...labelProps}
        className="block text-sm font-medium text-gray-700 text-left cursor-default"
      >
        {props.label}
      </div>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={mergeRefs(ref, triggerProps.ref)}
        className={
          cx(`p-1 pl-3 py-1 relative inline-flex flex-row items-center justify-between rounded-md overflow-hidden cursor-default shadow-sm border-2 outline-none`,  isFocusVisible ? "border-primary-500" : "border-gray-300", state.isOpen ? "bg-gray-100" : "bg-white", props.buttonClassName)
        }
      >
        <span
          {...valueProps}
          className={`text-md ${
            state.selectedItem ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {state.selectedItem
            ? state.selectedItem.rendered
            : "Select an option"}
        </span>
        <SelectorIcon
          label="SelectIcon"
          className={`w-5 h-5 ${
            isFocusVisible ? "text-pink-500" : "text-gray-500"
          }`}
        />
      </button>
      {state.isOpen && (
        <Popover side={layerSide} isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}
