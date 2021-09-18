import { ComboBox, Item, SelectBox, SearchAutocomplete, Section } from "../src";

export default {
  title: "SelectBox",
  component: ComboBox,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const combobox = () => (
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
);

export const selectbox = () => (
  <SelectBox label="Favorite Animal">
    <Item key="red panda">Red Panda</Item>
    <Item key="cat">Cat</Item>
    <Item key="dog">Dog</Item>
    <Item key="aardvark">Aardvark</Item>
    <Item key="kangaroo">Kangaroo</Item>
    <Item key="snake">Snake</Item>
  </SelectBox>
)

export const searchautocomplete = () => (
  <SearchAutocomplete label="Search" allowsCustomValue>
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
)
