
import type { ComboBoxProps } from "@react-types/combobox"
import { ChevronDownIcon } from "@deepui/icon"
import { cx } from "@deepui/utils"
export { Item, Section } from "@react-stately/collections"
import { useComboBoxState } from "@react-stately/combobox"
import * as React from "react"
import { useButton, useComboBox, useFilter } from "react-aria"
import { useLayer, mergeRefs } from "react-laag"

import { ListBox } from "./ListBox"
import { Popover } from "./Popover"


interface CustomComboBoxProps<T> extends ComboBoxProps<T> {
  layerClassName?: string
  wrapperClassName?: string
  inputClassName?: string
  buttonClassName?: string
}

function ComboBoxBase<T extends object>(props: CustomComboBoxProps<T>, ref: React.ForwardedRef<null>) {
  const { contains } = useFilter({ sensitivity: "base" })
  const state = useComboBoxState({ ...props, defaultFilter: contains })

  const buttonRef = React.useRef(null)
  const inputRef = ref ? ref : React.useRef(null)
  const listBoxRef = React.useRef(null)
  const popoverRef = React.useRef(null)

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

  const {
    buttonProps: buttonTriggerProps,
    inputProps,
    labelProps,
    listBoxProps
  } = useComboBox(
    {
      ...props,
      // @ts-ignore
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef
    },
    state
  )

  const { buttonProps } = useButton({ ...buttonTriggerProps, isDisabled: props.isDisabled }, buttonRef)

  return (
    <div ref={layerProps.ref} className={cx("relative w-full", props.layerClassName)}>
      {props.label ? <label
        {...labelProps}
        className="block text-sm font-medium text-gray-700 text-left"
      >
        {props.label}
      </label> : <label className="sr-only" aria-label="Combobox Select">Combobox Select</label>}
      <div
        className={cx(`w-full relative inline-flex flex-row rounded-md overflow-hidden shadow-sm border-2`, state.isFocused ? "border-primary-500" : "border-gray-300", props.wrapperClassName)}
      >
        <input {...inputProps} aria-label="select" ref={mergeRefs(inputRef, triggerProps.ref)} className={cx("w-full outline-none px-3 py-1 border-none", props.inputClassName)} />
        <button
          {...buttonProps}
          ref={mergeRefs(buttonRef, triggerProps.ref)}
          disabled={props.isDisabled}
          aria-disabled={props.isDisabled}
          className={cx(`px-1 bg-gray-100 cursor-default border-l-2`,  state.isFocused
          ? "border-primary-500 text-primary-600"
          : "border-gray-300 text-gray-500", props.buttonClassName)}
        >
          <ChevronDownIcon label="ChevronDownIcon" className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      {state.isOpen && (
        <Popover side={layerSide} popoverRef={popoverRef} isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state as any} />
        </Popover>
      )}
    </div>
  )
}

export const ComboBox = React.forwardRef(ComboBoxBase)
