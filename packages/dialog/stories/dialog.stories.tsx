import { useState } from "react"
import { Dialog } from "../src"
import { BasicDialog } from "./BasicDialog"

export default {
  title: "Dialog",
  component: Dialog,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const basic = () => (
  <div>
    <BasicDialog />
  </div>
);

export const withoutFocusableComponent = () => {
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <button onClick={() => { setIsActive(true) }}>Show Dialog</button>
      <Dialog
        isActive={isActive}
        onClose={() => setIsActive(false)}
        focusTrapProps={{
          active: false,
        }}
      >
        <div>Dialog Component</div>
      </Dialog>
    </>
  )
}

export const drawer = () => {
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <button onClick={() => { setIsActive(true) }}>Show Dialog</button>
      <Dialog
        isActive={isActive}
        onClose={() => setIsActive(false)}
        focusTrapProps={{
          active: false,
        }}
        justifyContent="right"
        initial={{
          opacity: 0,
          x: 200
          // config: {
          //   tension: 1000,
          // },
        }}
        enter={{
          height: '100%',
          opacity: 1,
          x: 0
          // config: {
          //   tension: 9000,
          // },
        }}
        leave={{
          opacity: 0,
          x: 200
        }}
      >
        <div style={{ background: 'white', height: "100%" }}>Drawer Component</div>
      </Dialog>
    </>
  )
}