import * as React from "react";
import { cx } from "@deepui/utils";
import { SearchIcon, XIcon } from "@heroicons/react/solid";
import type { ComboBoxProps } from "@react-types/combobox";
import { useComboBox, useFilter, useButton, useSearchField } from "react-aria";
import { useLayer, mergeRefs } from "react-laag"
import { useComboBoxState, useSearchFieldState } from "react-stately";

import { ListBox } from "./ListBox";
import { Popover } from "./Popover";

export { Item } from "react-stately";

interface CustomComboBoxProps<T> extends ComboBoxProps<T> {
  layerClassName?: string
  wrapperClassName?: string
  inputClassName?: string
  buttonClassName?: string
}

function SearchAutocompleteBase<T extends object>(props: CustomComboBoxProps<T>, ref: React.ForwardedRef<null>) {
  let { contains } = useFilter({ sensitivity: "base" });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  let inputRef = ref ? ref : React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      // @ts-ignore
      inputRef,
      listBoxRef,
      popoverRef
    },
    state
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

  // Get props for the clear button from useSearchField
  let searchProps = {
    label: props.label,
    value: state.inputValue,
    onChange: (v: string) => state.setInputValue(v)
  };

  let searchState = useSearchFieldState(searchProps);
  // @ts-ignore
  let { clearButtonProps } = useSearchField(searchProps, searchState, inputRef);
  let clearButtonRef = React.useRef(null);
  let { buttonProps } = useButton(clearButtonProps, clearButtonRef);

  return (
    <div ref={layerProps.ref} className={cx("w-full relative mt-4", props.layerClassName)}>
      <label
        {...labelProps}
        className="block text-sm font-medium text-gray-700 text-left"
      >
        {props.label}
      </label>
      <div
        className={cx(`w-full relative px-2 inline-flex flex-row items-center rounded-md overflow-hidden shadow-sm border-2`,  state.isFocused ? "border-primary-500" : "border-gray-300", props.wrapperClassName)}
      >
        <SearchIcon aria-hidden="true" className="w-5 h-5 text-gray-500" />
        <input
          {...inputProps}
          ref={mergeRefs(inputRef, triggerProps.ref)}
          style={{ boxShadow: "none" }}
          className={cx("w-full shadow-none outline-none px-3 py-1 appearance-none  border-none", props.inputClassName)}
        />
        <button
          {...buttonProps}
          ref={clearButtonRef}
          style={{ visibility: state.inputValue !== "" ? "visible" : "hidden" }}
          className={cx("cursor-default text-gray-500 hover:text-gray-600", props.buttonClassName)}
        >
          <XIcon aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>
      {state.isOpen && (
        <Popover
          side={layerSide}
          popoverRef={popoverRef}
          isOpen={state.isOpen}
          onClose={state.close}
        >
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
}

export const SearchAutocomplete = React.forwardRef(SearchAutocompleteBase)
