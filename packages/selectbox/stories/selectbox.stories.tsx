import { useRef } from "react"
import { ComboBox, Item, SelectBox, SearchAutocomplete, Section } from "../src";

export default {
  title: "SelectBox",
  component: ComboBox,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const combobox = () => {
  const customRef = useRef(null)
  return (
    <div>
      <div>
        <ComboBox label="Favorite Animal">
            <Item key="red panda">Red Panda</Item>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
            <Item key="aardvark">Aardvark</Item>
            <Item key="kangaroo">Kangaroo</Item>
            <Item key="snake">Snake</Item>
          </ComboBox>
      </div>
      <div style={{ height: 600, background: "red" }}>
        <button onClick={() => {
          // console.log(customRef)
          customRef.current.focus()
        }}>Focus</button>
      </div>
      <div style={{ width : 120, }}>
        <ComboBox ref={customRef}>
            <Item key="red panda">Red Panda</Item>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
            <Item key="aardvark">Aardvark</Item>
            <Item key="kangaroo">Kangaroo</Item>
            <Item key="snake">Snake</Item>
          </ComboBox>
      </div>
    </div>
  )
};

export const selectbox = () => {
  return (
    <SelectBox label="Favorite Animal">
      <Item key="red panda">Red Panda</Item>
      <Item key="cat">Cat</Item>
      <Item key="dog">Dog</Item>
      <Item key="aardvark">Aardvark</Item>
      <Item key="kangaroo">Kangaroo</Item>
      <Item key="snake">Snake</Item>
    </SelectBox>
  )
}

export const searchautocomplete = () => {
  const customRef = useRef(null)
  return (
    <div>
      <button onClick={() => {
        customRef.current.focus()
      }}>Focus</button>
      <SearchAutocomplete ref={customRef} label="Search" allowsCustomValue>
        <Section title="Companies">
          <Item>Chatterbridge</Item>
          <Item>Tagchat</Item>
          <Item>Yambee</Item>
          <Item>Photobug</Item>
          <Item>Livepath</Item>
        </Section>
        <Section title="People">
          <Item>Theodor Dawber</Item>
          <Item>Dwight Stollenberg</Item>
          <Item>Maddalena Prettjohn</Item>
          <Item>Maureen Fassan</Item>
          <Item>Abbie Binyon</Item>
        </Section>
      </SearchAutocomplete>
    </div>
  )
}
