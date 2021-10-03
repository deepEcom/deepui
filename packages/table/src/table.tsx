// @ts-nocheck
import { cx } from "@deepui/utils";
import {mergeProps} from '@react-aria/utils';
import React from 'react';
import {useCheckbox} from '@react-aria/checkbox';
import {useFocusRing} from '@react-aria/focus';
import {useRef} from 'react';
import {useTable, useTableCell, useTableColumnHeader, useTableHeaderRow, useTableRow, useTableRowGroup, useTableSelectAllCheckbox, useTableSelectionCheckbox} from '@react-aria/table';
import {useTableState} from '@react-stately/table';
import {useToggleState} from '@react-stately/toggle';
import {VisuallyHidden} from '@react-aria/visually-hidden';

export function Table(props) {
  let state = useTableState({...props, showSelectionCheckboxes: props.selectionMode === 'multiple'});
  let ref = useRef();
  let bodyRef = useRef();
  let {collection} = state;
  let {gridProps} = useTable({...props, scrollRef: props.scrollRef ? props.scrollRef : bodyRef}, state, ref);

  return (
    <table {...gridProps} ref={ref} className={cx("min-w-full divide-y divide-gray-200", props.className)}>
      <TableRowGroup type="thead" className={cx("bg-gray-50", props.headerRowGroupClassName)}>
        {collection.headerRows.map(headerRow => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state} className={props.headerRowClassName}>
            {[...headerRow.childNodes].map(column =>
              column.props.isSelectionCell
                ? <TableSelectAllCell key={column.key} column={column} state={state} className={cx(props.selectClassName, props.selectAllClassName)} />
                : <TableColumnHeader key={column.key} column={column} state={state} className={cx(props.headerCellClassName)} />
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup ref={bodyRef} type="tbody" className={cx("bg-white divide-y divide-gray-200", props.bodyRowGroupClassName)}>
        {[...collection.body.childNodes].map(row => (
          <TableRow key={row.key} item={row} state={state} className={cx(props.bodyRowClassName)}>
            {[...row.childNodes].map(cell =>
              cell.props.isSelectionCell
                ? <TableCheckboxCell key={cell.key} cell={cell} state={state} className={cx(props.selectClassName)} />
                : <TableCell key={cell.key} cell={cell} state={state} className={cx(props.bodyCellClassName)}  />
            )}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
  );
}

const TableRowGroup = React.forwardRef((props: any, ref) => {
  let {type: Element, style, className, children} = props;
  let {rowGroupProps} = useTableRowGroup();
  return (
    <Element ref={ref} {...rowGroupProps} style={style} className={cx(className)}>
      {children}
    </Element>
  );
});

function TableHeaderRow({item, state, children, className}) {
  let ref = useRef();
  let {rowProps} = useTableHeaderRow({node: item}, state, ref);

  return (
    <tr {...rowProps} className={cx(className)} ref={ref}>
      {children}
    </tr>
  );
}

function TableColumnHeader({column, state, className}) {
  let ref = useRef();
  let {columnHeaderProps} = useTableColumnHeader({node: column}, state, ref);
  let {isFocusVisible, focusProps} = useFocusRing();
  let arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      scope="col"
      // style={{
      //   textAlign: column.colspan > 1 ? 'center' : 'left',
      //   padding: '5px 10px',
      //   outline: isFocusVisible ? '2px solid orange' : 'none',
      //   cursor: 'default'
      // }}
      className={cx([
        `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`,
        isFocusVisible ? 'border border-primary-500' : 'border-none',
        className
      ])}
      ref={ref}>
      {column.rendered}
      {column.props.allowsSorting &&
        <span aria-hidden="true" className="px-4" style={{visibility: state.sortDescriptor?.column === column.key ? 'visible' : 'hidden'}}>
          {arrowIcon}
        </span>
      }
    </th>
  );
}

function TableRow({item, children, state, className}) {
  let ref = useRef();
  let isSelected = state.selectionManager.isSelected(item.key);
  let {rowProps} = useTableRow({node: item}, state, ref);
  let {isFocusVisible, focusProps} = useFocusRing();

  return (
    <tr
      // style={{
      //   // eslint-disable-next-line no-nested-ternary
      //   background: isSelected
      //     ? 'blueviolet'
      //     : item.index % 2
      //       ? 'lightgray'
      //       : 'none',
      //   color: isSelected ? 'white' : null,
      //   outline: isFocusVisible ? '2px solid orange' : 'none'
      // }}
      className={cx([
        isSelected ? 'bg-primary-100 text-white' : item.index % 2 ? 'bg-gray-50' : 'bg-white',
        isFocusVisible ? 'outline outline-black' : 'outline-none',
        className
      ])}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}>
      {children}
    </tr>
  );
}

function TableCell({cell, state, className}) {
  let ref = useRef();
  let {gridCellProps} = useTableCell({node: cell}, state, ref);
  let {isFocusVisible, focusProps} = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      // style={{
      //   padding: '5px 10px',
      //   outline: isFocusVisible ? '2px solid orange' : 'none',
      //   cursor: 'default'
      // }}
      className={cx("px-6 py-4 whitespace-nowrap", className)}
      ref={ref}>
      {cell.rendered}
    </td>
  );
}

function TableCheckboxCell({cell, state, className}) {
  let ref = useRef();
  let {gridCellProps} = useTableCell({node: cell}, state, ref);
  let {checkboxProps} = useTableSelectionCheckbox({key: cell.parentKey}, state);

  let inputRef = useRef(null);
  let {inputProps} = useCheckbox(checkboxProps, useToggleState(checkboxProps), inputRef);

  return (
    <td
      {...gridCellProps}
      className={cx("text-center", className)}
      ref={ref}>
      <input {...inputProps} />
    </td>
  );
}

function TableSelectAllCell({column, state, className}) {
  let ref = useRef();
  let isSingleSelectionMode = state.selectionManager.selectionMode === 'single';
  let {columnHeaderProps} = useTableColumnHeader({node: column}, state, ref);

  let {checkboxProps} = useTableSelectAllCheckbox(state);
  let inputRef = useRef(null);
  let {inputProps} = useCheckbox(checkboxProps, useToggleState(checkboxProps), inputRef);

  return (
    <th
      {...columnHeaderProps}
      ref={ref}>
      {
        /*
          In single selection mode, the checkbox will be hidden.
          So to avoid leaving a column header with no accessible content,
          use a VisuallyHidden component to include the aria-label from the checkbox,
          which for single selection will be "Select."
        */
        isSingleSelectionMode &&
        <VisuallyHidden>{inputProps['aria-label']}</VisuallyHidden>
      }
      <input
        {...inputProps}
        ref={inputRef}
        className={cx(className)}
        style={isSingleSelectionMode ? {visibility: 'hidden'} : undefined} />
    </th>
  );
}
