// import { createMemoClass } from "@deepui/theme";
import { ChevronDownIcon } from "@heroicons/react/solid"
import { useComboBoxState } from "@react-stately/combobox"
import type { ComboBoxProps } from "@react-types/combobox"
import * as React from "react"
import { useButton, useComboBox, useFilter } from "react-aria"

import { ListBox } from "./ListBox"
import { Popover } from "./Popover"

export { Item, Section } from "react-stately"

export function ComboBox<T extends object>(props: ComboBoxProps<T>) {
  const { contains } = useFilter({ sensitivity: "base" })
  const state = useComboBoxState({ ...props, defaultFilter: contains })

  const buttonRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const listBoxRef = React.useRef(null)
  const popoverRef = React.useRef(null)

  const {
    buttonProps: triggerProps,
    inputProps,
    labelProps,
    listBoxProps
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef
    },
    state
  )

  const { buttonProps } = useButton({ ...triggerProps, isDisabled: props.isDisabled }, buttonRef)

  return (
    <div className="inline-flex flex-col relative">
      <label
        {...labelProps}
        className="block text-sm font-medium text-gray-700 text-left"
      >
        {props.label}
      </label>
      <div
        className={`relative inline-flex flex-row rounded-md overflow-hidden shadow-sm border-2 ${
          state.isFocused ? "border-primary-500" : "border-gray-300"
        }`}
      >
        <input {...inputProps} ref={inputRef} className="outline-none px-3 py-1 border-none" />
        <button
          {...buttonProps}
          ref={buttonRef}
          disabled={props.isDisabled}
          aria-disabled={props.isDisabled}
          className={`px-1 bg-gray-100 cursor-default border-l-2 ${
            state.isFocused
              ? "border-primary-500 text-primary-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      {state.isOpen && (
        <Popover popoverRef={popoverRef} isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  )
}
