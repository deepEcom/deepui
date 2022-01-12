import { useRef, useEffect } from "react"
import { ComboBox, Item, SelectBox, SearchAutocomplete, Section } from "../src";
import { useAsyncList } from '@react-stately/data';
import {Cell, Column, Row, TableBody, TableHeader} from '@react-stately/table';
import { Table } from "../../table/src/index";

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

let columns = [
  {name: 'Name', uid: 'name'},
  {name: 'Type', uid: 'type'},
  {name: 'Level', uid: 'level'}
];

interface StarWarsCharacter {
  name: string;
}

const ComboBoxD = () => {
  const inputRef = useRef(null)
  let list = useAsyncList<StarWarsCharacter>({
    async load({ signal, cursor, filterText, ...rest }) {
      // console.log("LOADING")
      // console.log("IS FOCUSaED", inputRef.current.isFocused())
      // if (!inputRef || (inputRef && !inputRef.current.isFocused())) {
      //   return {
      //     items: []
      //   }
      // }
      console.log("LOADINGG")
      if (cursor) {
        cursor = cursor.replace(/^http:\/\//i, "https://");
      }

      // console.log(signal)
      // console.log(rest)

      // If no cursor is available, then we're loading the first page,
      // filtering the results returned via a query string that
      // mirrors the input text.
      // Otherwise, the cursor is the next URL to load,
      // as returned from the previous page.
      let res = await fetch(
        cursor || `https://pokeapi.co/api/v2/pokemon/?search=${filterText}`,
        { signal }
      );
      let json = await res.json();

      return {
        items: json.results,
        cursor: json.next
      };
    }
  });
  return <div>
      <SearchAutocomplete
        ref={inputRef}
        items={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        loadingState={list.loadingState}
        onLoadMore={list.loadMore}>
        {(item) => <Item key={item.name}>{item.name}</Item>}
      </SearchAutocomplete>
</div>
}

let rows = [
  {id: 1, name: 'Charizard', type: 'Fire, Flying', level: <ComboBoxD />},
  {id: 2, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 3, name: 'Venusaur', type: 'Grass, Poison', level: <ComboBoxD />},
  {id: 4, name: 'Pikachu', type: 'Electric', level: '100'},
  {id: 5, name: 'Charizard', type: 'Fire, Flying', level: <ComboBoxD />},
  {id: 6, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 7, name: 'Venusaur', type: 'Grass, Poison', level: <ComboBoxD />},
];

export const TableTest = () => {  
  return (
  <div>
    <input aria-label="Focusable before" placeholder="Focusable before" />
    <Table aria-label="Table with selection" selectionMode="multiple" sortDescriptor={{
      column: 'name',
      direction: 'descending'
    }}>
      <TableHeader columns={columns}>
        {column => (
          <Column key={column.uid} allowsSorting>
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {item => (
          <Row>
            {columnKey => <Cell>{item[columnKey]}</Cell>}
          </Row>
        )}
      </TableBody>
    </Table>
    <input aria-label="Focusable after" placeholder="Focusable after" />
  </div>
)};