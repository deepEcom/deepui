import { CheckIcon } from "@heroicons/react/solid"
import type { AriaListBoxOptions } from "@react-aria/listbox"
import type { ListState } from "@react-stately/list"
import type { Node } from "@react-types/shared"
import * as React from "react"
import { useListBox, useListBoxSection, useOption } from "react-aria"

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>
  state: ListState<unknown>
}

interface SectionProps {
  section: Node<unknown>
  state: ListState<unknown>
}

interface OptionProps {
  item: Node<unknown>
  state: ListState<unknown>
}

export function ListBox(props: ListBoxProps) {
  const ref = React.useRef<HTMLUListElement>(null)
  const { listBoxRef = ref, state } = props
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="max-h-72 overflow-auto outline-none"
    >
      {[...state.collection].map((item) =>
        item.type === "section" ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  )
}

function ListBoxSection({ section, state }: SectionProps) {
  const { groupProps, headingProps, itemProps } = useListBoxSection({
    heading: section.rendered,
    "aria-label": section["aria-label"]
  })

  return (
    <>
      <li {...itemProps} className="pt-2">
        {section.rendered && (
          <span
            {...headingProps}
            className="text-xs font-bold uppercase text-gray-500 mx-3"
          >
            {section.rendered}
          </span>
        )}
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  )
}

function Option({ item, state }: OptionProps) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { isDisabled, isFocused, isSelected, optionProps } = useOption(
    {
      key: item.key
    },
    state,
    ref
  )

  let text = "text-gray-700"
  if (isFocused || isSelected) {
    text = "text-primary-600"
  } else if (isDisabled) {
    text = "text-gray-200"
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      className={`m-1 rounded-md py-2 px-2 text-sm outline-none cursor-default flex items-center justify-between ${text} ${
        isFocused ? "bg-primary-100" : ""
      } ${isSelected ? "font-bold" : ""}`}
    >
      {item.rendered}
      {isSelected && (
        <CheckIcon aria-hidden="true" className="w-5 h-5 text-primary-600" />
      )}
    </li>
  )
}