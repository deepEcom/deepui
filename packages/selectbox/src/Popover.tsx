import * as React from "react"
import { DismissButton, FocusScope, useOverlay } from "react-aria"

interface PopoverProps {
  popoverRef?: React.RefObject<HTMLDivElement>
  children: React.ReactNode
  isOpen?: boolean
  onClose: () => void
}

export function Popover(props: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { popoverRef = ref, isOpen, onClose, children } = props

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: false
    },
    popoverRef
  )

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <div
        {...overlayProps}
        ref={popoverRef}
        className="absolute z-10 top-full w-full shadow-lg border border-gray-300 bg-white rounded-md mt-2"
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  )
}
