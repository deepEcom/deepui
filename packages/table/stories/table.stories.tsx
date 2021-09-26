import {useRef} from 'react';
import {Cell, Column, Row, TableBody, TableHeader} from '@react-stately/table';
import { Table } from "../src";

export default {
  title: "Table",
  component: Table,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

let columns = [
  {name: 'Name', uid: 'name'},
  {name: 'Type', uid: 'type'},
  {name: 'Level', uid: 'level'}
];

let rows = [
  {id: 1, name: 'Charizard', type: 'Fire, Flying', level: '67'},
  {id: 2, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 3, name: 'Venusaur', type: 'Grass, Poison', level: '83'},
  {id: 4, name: 'Pikachu', type: 'Electric', level: '100'},
  {id: 5, name: 'Charizard', type: 'Fire, Flying', level: '67'},
  {id: 6, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 7, name: 'Venusaur', type: 'Grass, Poison', level: '83'},
  {id: 8, name: 'Pikachu', type: 'Electric', level: '100'},
  {id: 9, name: 'Charizard', type: 'Fire, Flying', level: '67'},
  {id: 10, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 11, name: 'Venusaur', type: 'Grass, Poison', level: '83'},
  {id: 12, name: 'Pikachu', type: 'Electric', level: '100'}
];

export const basic = () => (
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
);

export const heightTest = () => {
  const scrollRef = useRef()
  return (
    <div ref={scrollRef} style={{ height: 300, overflow: 'hidden' }}>
      <input aria-label="Focusable before" placeholder="Focusable before" />
      <Table scrollRef={scrollRef} aria-label="Table with selection">
        <TableHeader columns={columns}>
          {column => (
            <Column key={column.uid}>
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
  );
};

