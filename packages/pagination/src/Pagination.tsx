import React, { cloneElement, isValidElement } from "react"
import { cx } from '@deepui/utils'
import Pager from "./Pager"
import Options from "./Options"
import KEYCODE from './KeyCode';

const LOCALE = {
  // Options.jsx
  items_per_page: '/ page',
  jump_to: 'Go to',
  jump_to_confirm: 'confirm',
  page: '',

  // Pagination.jsx
  prev_page: 'Previous Page',
  next_page: 'Next Page',
  prev_5: 'Previous 5 Pages',
  next_5: 'Next 5 Pages',
  prev_3: 'Previous 3 Pages',
  next_3: 'Next 3 Pages',
}

function noop() {}

function isInteger(value: number) {
  return (
    // eslint-disable-next-line no-restricted-globals
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
}

function defaultItemRender(page: any, type: any, element: any) {
  return element;
}

function calculatePage(p: undefined, state: Readonly<{}> | undefined, props: Readonly<{}> & Readonly<{ children?: React.ReactNode; }>) {
  //@ts-ignore
  const pageSize = typeof p === 'undefined' ? state.pageSize : p;
  //@ts-ignore
  return Math.floor((props.total - 1) / pageSize) + 1;
}

export class Pagination extends React.Component<any, any> {
  static defaultProps = {
    defaultCurrent: 1,
    total: 0,
    defaultPageSize: 10,
    onChange: noop,
    className: '',
    selectPrefixCls: 'rc-select',
    prefixCls: 'rc-pagination',
    selectComponentClass: null,
    hideOnSinglePage: false,
    showPrevNextJumpers: true,
    showQuickJumper: false,
    showLessItems: false,
    showTitle: true,
    onShowSizeChange: noop,
    locale: LOCALE,
    style: {},
    itemRender: defaultItemRender,
    totalBoundaryShowSizeChanger: 50,
  };

  constructor(props: {} | Readonly<{}>) {
    super(props);
    // @ts-ignore
    const hasOnChange = props.onChange !== noop;
    const hasCurrent = 'current' in props;
    if (hasCurrent && !hasOnChange) {
      // eslint-disable-next-line no-console
      console.warn(
        'Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.',
      );
    }
    // @ts-ignore
    let current = props.defaultCurrent;
    if ('current' in props) {
      // @ts-ignore
      current = props.current;
    }
    // @ts-ignore
    let pageSize = props.defaultPageSize;
    if ('pageSize' in props) {
      // @ts-ignore
      pageSize = props.pageSize;
    }

    current = Math.min(current, calculatePage(pageSize, undefined, props));

    this.state = {
      current,
      currentInputValue: current,
      pageSize,
    };
  }

  componentDidUpdate(prevProps: any, prevState: { current: any; }) {
    // When current page change, fix focused style of prev item
    // A hacky solution of https://github.com/ant-design/ant-design/issues/8948
    const { prefixCls } = this.props;
    // @ts-ignore
    if (prevState.current !== this.state.current && this.paginationNode) {
      // @ts-ignore
      const lastCurrentNode = this.paginationNode.querySelector(
        `.${prefixCls}-item-${prevState.current}`,
      );
      if (lastCurrentNode && document.activeElement === lastCurrentNode) {
        lastCurrentNode.blur();
      }
    }
  }

  static getDerivedStateFromProps(props: { current: any; pageSize: any; }, prevState: { current: any; pageSize?: any; }) {
    const newState = {};

    if ('current' in props) {
      // @ts-ignore
      newState.current = props.current;

      if (props.current !== prevState.current) {
        // @ts-ignore
        newState.currentInputValue = newState.current;
      }
    }

    if ('pageSize' in props && props.pageSize !== prevState.pageSize) {
      let { current } = prevState;
      const newCurrent = calculatePage(props.pageSize, prevState, props);
      current = current > newCurrent ? newCurrent : current;

      if (!('current' in props)) {
        // @ts-ignore
        newState.current = current;
        // @ts-ignore
        newState.currentInputValue = current;
      }
      // @ts-ignore
      newState.pageSize = props.pageSize;
    }

    return newState;
  }

  getJumpPrevPage = () =>
    Math.max(1, this.state.current - (this.props.showLessItems ? 3 : 5));

  getJumpNextPage = () =>
    Math.min(
      calculatePage(undefined, this.state, this.props),
      this.state.current + (this.props.showLessItems ? 3 : 5),
    );

  /**
   * computed icon node that need to be rendered.
   * @param {React.ReactNode | React.ComponentType<PaginationProps>} icon received icon.
   * @returns {React.ReactNode}
   */
  getItemIcon = (icon: JSX.Element, label: string | undefined) => {
    const { prefixCls } = this.props;
    let iconNode = icon || (
      <button
        type="button"
        aria-label={label}
        className={`${prefixCls}-item-link`}
      />
    );
    if (typeof icon === 'function') {
      iconNode = React.createElement(icon, { ...this.props });
    }
    return iconNode;
  };

  getValidValue(e: { target: { value: any; }; }) {
    const inputValue = e.target.value;
    const allPages = calculatePage(undefined, this.state, this.props);
    const { currentInputValue } = this.state;
    let value;
    if (inputValue === '') {
      value = inputValue;
      // eslint-disable-next-line no-restricted-globals
    } else if (isNaN(Number(inputValue))) {
      value = currentInputValue;
    } else if (inputValue >= allPages) {
      value = allPages;
    } else {
      value = Number(inputValue);
    }
    return value;
  }

  savePaginationNode = (node: any) => {
    // @ts-ignore
    this.paginationNode = node;
  };

  isValid = (page: any) => isInteger(page) && page !== this.state.current;

  shouldDisplayQuickJumper = () => {
    const { showQuickJumper, pageSize, total } = this.props;
    if (total <= pageSize) {
      return false;
    }
    return showQuickJumper;
  };

  handleKeyDown = (e: { keyCode: number; preventDefault: () => void; }) => {
    if (e.keyCode === KEYCODE.ARROW_UP || e.keyCode === KEYCODE.ARROW_DOWN) {
      e.preventDefault();
    }
  };

  handleKeyUp = (e: any) => {
    const value = this.getValidValue(e);
    const { currentInputValue } = this.state;
    if (value !== currentInputValue) {
      this.setState({
        currentInputValue: value,
      });
    }
    if (e.keyCode === KEYCODE.ENTER) {
      this.handleChange(value);
    } else if (e.keyCode === KEYCODE.ARROW_UP) {
      this.handleChange(value - 1);
    } else if (e.keyCode === KEYCODE.ARROW_DOWN) {
      this.handleChange(value + 1);
    }
  };

  changePageSize = (size: any) => {
    let { current } = this.state;
    const newCurrent = calculatePage(size, this.state, this.props);
    current = current > newCurrent ? newCurrent : current;
    // fix the issue:
    // Once 'total' is 0, 'current' in 'onShowSizeChange' is 0, which is not correct.
    if (newCurrent === 0) {
      // eslint-disable-next-line prefer-destructuring
      current = this.state.current;
    }

    if (typeof size === 'number') {
      if (!('pageSize' in this.props)) {
        this.setState({
          pageSize: size,
        });
      }
      if (!('current' in this.props)) {
        this.setState({
          current,
          currentInputValue: current,
        });
      }
    }

    this.props.onShowSizeChange(current, size);

    if ('onChange' in this.props && this.props.onChange) {
      this.props.onChange(current, size);
    }
  };

  handleChange = (p: number) => {
    const { disabled } = this.props;

    let page = p;
    if (this.isValid(page) && !disabled) {
      const currentPage = calculatePage(undefined, this.state, this.props);
      if (page > currentPage) {
        page = currentPage;
      } else if (page < 1) {
        page = 1;
      }

      if (!('current' in this.props)) {
        this.setState({
          current: page,
          currentInputValue: page,
        });
      }

      const { pageSize } = this.state;
      this.props.onChange(page, pageSize);

      return page;
    }

    return this.state.current;
  };

  prev = () => {
    if (this.hasPrev()) {
      this.handleChange(this.state.current - 1);
    }
  };

  next = () => {
    if (this.hasNext()) {
      this.handleChange(this.state.current + 1);
    }
  };

  jumpPrev = () => {
    this.handleChange(this.getJumpPrevPage());
  };

  jumpNext = () => {
    this.handleChange(this.getJumpNextPage());
  };

  hasPrev = () => this.state.current > 1;

  hasNext = () =>
    this.state.current < calculatePage(undefined, this.state, this.props);

  getShowSizeChanger() {
    const { showSizeChanger, total, totalBoundaryShowSizeChanger } = this.props;
    if (typeof showSizeChanger !== 'undefined') {
      return showSizeChanger;
    }
    return total > totalBoundaryShowSizeChanger;
  }

  runIfEnter = (event: { key: string; charCode: number; }, callback: { (): void; (): void; (): void; (): void; (arg0: any): void; }, ...restParams: undefined[]) => {
    if (event.key === 'Enter' || event.charCode === 13) {
      // @ts-ignore
      callback(...restParams);
    }
  };

  runIfEnterPrev = (e: any) => {
    this.runIfEnter(e, this.prev);
  };

  runIfEnterNext = (e: any) => {
    this.runIfEnter(e, this.next);
  };

  runIfEnterJumpPrev = (e: any) => {
    this.runIfEnter(e, this.jumpPrev);
  };

  runIfEnterJumpNext = (e: any) => {
    this.runIfEnter(e, this.jumpNext);
  };

  handleGoTO = (e: { keyCode: number; type: string; }) => {
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      this.handleChange(this.state.currentInputValue);
    }
  };

  renderPrev(prevPage: number) {
    const { prevIcon, itemRender } = this.props;
    const prevButton = itemRender(
      prevPage,
      'prev',
      this.getItemIcon(prevIcon, 'prev page'),
    );
    const disabled = !this.hasPrev();
    return isValidElement(prevButton)
    // @ts-ignore
      ? cloneElement(prevButton, { disabled })
      : prevButton;
  }

  renderNext(nextPage: any) {
    const { nextIcon, itemRender } = this.props;
    const nextButton = itemRender(
      nextPage,
      'next',
      this.getItemIcon(nextIcon, 'next page'),
    );
    const disabled = !this.hasNext();
    return isValidElement(nextButton)
    // @ts-ignore
      ? cloneElement(nextButton, { disabled })
      : nextButton;
  }

  render() {
    const {
      prefixCls,
      className,
      style,
      disabled,
      hideOnSinglePage,
      total,
      locale,
      showQuickJumper,
      showLessItems,
      showTitle,
      showTotal,
      simple,
      itemRender,
      showPrevNextJumpers,
      jumpPrevIcon,
      jumpNextIcon,
      selectComponentClass,
      selectPrefixCls,
      pageSizeOptions,
      color
    } = this.props;

    const { current, pageSize, currentInputValue } = this.state;

    // When hideOnSinglePage is true and there is only 1 page, hide the pager
    if (hideOnSinglePage === true && total <= pageSize) {
      return null;
    }

    const allPages = calculatePage(undefined, this.state, this.props);
    const pagerList = [];
    let jumpPrev = null;
    let jumpNext = null;
    let firstPager = null;
    let lastPager = null;
    let gotoButton = null;

    const goButton = showQuickJumper && showQuickJumper.goButton;
    const pageBufferSize = showLessItems ? 1 : 2;

    const prevPage = current - 1 > 0 ? current - 1 : 0;
    const nextPage = current + 1 < allPages ? current + 1 : allPages;

    const dataOrAriaAttributeProps = Object.keys(this.props).reduce(
      (prev, key) => {
        if (
          key.substr(0, 5) === 'data-' ||
          key.substr(0, 5) === 'aria-' ||
          key === 'role'
        ) {
          // eslint-disable-next-line no-param-reassign
          prev[key] = this.props[key];
        }
        return prev;
      },
      {},
    );

    if (simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button
              type="button"
              // @ts-ignore
              onClick={this.handleGoTO}
              onKeyUp={this.handleGoTO}
            >
              {locale.jump_to_confirm}
            </button>
          );
        } else {
          gotoButton = (
            // @ts-ignore
            <span onClick={this.handleGoTO} onKeyUp={this.handleGoTO}>
              {goButton}
            </span>
          );
        }
        gotoButton = (
          <li
            // @ts-ignore
            title={showTitle ? `${locale.jump_to}${current}/${allPages}` : null}
            className={`${prefixCls}-simple-pager`}
          >
            {gotoButton}
          </li>
        );
      }

      return (
        <ul
          className={cx(
            prefixCls,
            `${prefixCls}-simple`,
            { [`${prefixCls}-disabled`]: disabled },
            className,
          )}
          style={style}
          ref={this.savePaginationNode}
          {...dataOrAriaAttributeProps}
        >
          <li
            title={showTitle ? locale.prev_page : null}
            onClick={this.prev}
            // @ts-ignore
            tabIndex={this.hasPrev() ? 0 : null}
            onKeyPress={this.runIfEnterPrev}
            className={cx(`${prefixCls}-prev`, !this.hasPrev() && `${prefixCls}-disabled`)}
            aria-disabled={!this.hasPrev()}
          >
            {this.renderPrev(prevPage)}
          </li>
          <li
            // @ts-ignore
            title={showTitle ? `${current}/${allPages}` : null}
            className={`${prefixCls}-simple-pager`}
          >
            <input
              type="text"
              value={currentInputValue}
              disabled={disabled}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              // @ts-ignore
              onChange={this.handleKeyUp}
              // @ts-ignore
              size="3"
            />
            <span className={`${prefixCls}-slash`}>/</span>
            {allPages}
          </li>
          <li
            title={showTitle ? locale.next_page : null}
            onClick={this.next}
            // @ts-ignore
            tabIndex={this.hasPrev() ? 0 : null}
            onKeyPress={this.runIfEnterNext}
            className={cx(`${prefixCls}-next`, !this.hasNext() && `${prefixCls}-disabled`)}
            aria-disabled={!this.hasNext()}
          >
            {this.renderNext(nextPage)}
          </li>
          {gotoButton}
        </ul>
      );
    }

    if (allPages <= 3 + pageBufferSize * 2) {
      const pagerProps = {
        locale,
        rootPrefixCls: prefixCls,
        onClick: this.handleChange,
        onKeyPress: this.runIfEnter,
        showTitle,
        itemRender,
      };
      if (!allPages) {
        pagerList.push(
          <Pager
            {...pagerProps}
            key="noPager"
            page={1}
            className={`${prefixCls}-item-disabled`}
          />,
        );
      }
      for (let i = 1; i <= allPages; i += 1) {
        const active = current === i;
        pagerList.push(
          <Pager {...pagerProps} key={i} page={i} active={active} color={color} />,
        );
      }
    } else {
      const prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
      const nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;
      if (showPrevNextJumpers) {
        jumpPrev = (
          <li
            title={showTitle ? prevItemTitle : null}
            key="prev"
            onClick={this.jumpPrev}
            // @ts-ignore
            tabIndex="0"
            onKeyPress={this.runIfEnterJumpPrev}
            className={cx(`${prefixCls}-jump-prev`, !!jumpPrevIcon && `${prefixCls}-jump-prev-custom-icon`)}
          >
            {itemRender(
              this.getJumpPrevPage(),
              'jump-prev',
              this.getItemIcon(jumpPrevIcon, 'prev page'),
            )}
          </li>
        );
        jumpNext = (
          <li
            title={showTitle ? nextItemTitle : null}
            key="next"
            // @ts-ignore
            tabIndex="0"
            onClick={this.jumpNext}
            onKeyPress={this.runIfEnterJumpNext}
            className={cx(`${prefixCls}-jump-next`, !!jumpNextIcon && `${prefixCls}-jump-next-custom-icon`)}
          >
            {itemRender(
              this.getJumpNextPage(),
              'jump-next',
              this.getItemIcon(jumpNextIcon, 'next page'),
            )}
          </li>
        );
      }
      lastPager = (
        <Pager
          locale={locale}
          last
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeyPress={this.runIfEnter}
          key={allPages}
          page={allPages}
          active={false}
          showTitle={showTitle}
          itemRender={itemRender}
        />
      );
      firstPager = (
        <Pager
          locale={locale}
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeyPress={this.runIfEnter}
          key={1}
          page={1}
          active={false}
          showTitle={showTitle}
          itemRender={itemRender}
        />
      );

      let left = Math.max(1, current - pageBufferSize);
      let right = Math.min(current + pageBufferSize, allPages);

      if (current - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2;
      }

      if (allPages - current <= pageBufferSize) {
        left = allPages - pageBufferSize * 2;
      }

      for (let i = left; i <= right; i += 1) {
        const active = current === i;
        pagerList.push(
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeyPress={this.runIfEnter}
            key={i}
            page={i}
            active={active}
            showTitle={showTitle}
            itemRender={itemRender}
            color={color}
          />,
        );
      }

      if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
        pagerList[0] = cloneElement(pagerList[0], {
          className: `${prefixCls}-item-after-jump-prev`,
        });
        pagerList.unshift(jumpPrev);
      }
      if (
        allPages - current >= pageBufferSize * 2 &&
        current !== allPages - 2
      ) {
        pagerList[pagerList.length - 1] = cloneElement(
          // @ts-ignore
          pagerList[pagerList.length - 1],
          {
            className: `${prefixCls}-item-before-jump-next`,
          },
        );
        pagerList.push(jumpNext);
      }

      if (left !== 1) {
        pagerList.unshift(firstPager);
      }
      if (right !== allPages) {
        pagerList.push(lastPager);
      }
    }

    let totalText = null;

    if (showTotal) {
      totalText = (
        <li className={`${prefixCls}-total-text`}>
          {showTotal(total, [
            total === 0 ? 0 : (current - 1) * pageSize + 1,
            current * pageSize > total ? total : current * pageSize,
          ])}
        </li>
      );
    }
    const prevDisabled = !this.hasPrev() || !allPages;
    const nextDisabled = !this.hasNext() || !allPages;
    return (
      <>
      <style>{`
        .rc-pagination-jump-prev button:after,
        .rc-pagination-jump-next button:after {
          display: block;
          content: '•••';
        }

        .rc-pagination-prev button:after {
          content: '‹';
          display: block;
        }
        .rc-pagination-next button:after {
          content: '›';
          display: block;
        }
      `}</style>
      <ul
        className={cx(prefixCls, className, disabled && `${prefixCls}-disabled`)}
        style={style}
        // @ts-ignore
        unselectable="unselectable"
        ref={this.savePaginationNode}
        {...dataOrAriaAttributeProps}
        aria-label="Pagination"
      >
        {totalText}
        <li
          title={showTitle ? locale.prev_page : null}
          onClick={this.prev}
          // @ts-ignore
          tabIndex={prevDisabled ? null : 0}
          onKeyPress={this.runIfEnterPrev}
          className={cx(`${prefixCls}-prev`,
            prevDisabled && `${prefixCls}-disabled`
           )}
          aria-disabled={prevDisabled}
        >
          {this.renderPrev(prevPage)}
        </li>
        {pagerList}
        <li
          title={showTitle ? locale.next_page : null}
          onClick={this.next}
          // @ts-ignore
          tabIndex={nextDisabled ? null : 0}
          onKeyPress={this.runIfEnterNext}
          className={cx(`${prefixCls}-next`, nextDisabled && `${prefixCls}-disabled`)}
          aria-disabled={nextDisabled}
        >
          {this.renderNext(nextPage)}
        </li>
        <Options
          disabled={disabled}
          locale={locale}
          rootPrefixCls={prefixCls}
          selectComponentClass={selectComponentClass}
          selectPrefixCls={selectPrefixCls}
          changeSize={this.getShowSizeChanger() ? this.changePageSize : null}
          current={current}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          quickGo={this.shouldDisplayQuickJumper() ? this.handleChange : null}
          goButton={goButton}
        />
      </ul>
      </>
    );
  }
}

/**
 * 
 *       <style>
        {`
        .rc-pagination {
          margin: 0;
          padding: 0;
          font-size: 14px;
        }
        .rc-pagination ul,
        .rc-pagination ol {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .rc-pagination::after {
          display: block;
          clear: both;
          height: 0;
          overflow: hidden;
          visibility: hidden;
          content: ' ';
        }
        .rc-pagination-total-text {
          display: inline-block;
          height: 28px;
          margin-right: 8px;
          line-height: 26px;
          vertical-align: middle;
        }
        .rc-pagination-item {
          display: inline-block;
          min-width: 28px;
          height: 28px;
          margin-right: 8px;
          font-family: Arial;
          line-height: 26px;
          text-align: center;
          vertical-align: middle;
          list-style: none;
          background-color: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          outline: 0;
          cursor: pointer;
          user-select: none;
        }
        .rc-pagination-item a {
          display: block;
          padding: 0 6px;
          color: rgba(0, 0, 0, 0.85);
          transition: none;
        }
        .rc-pagination-item a:hover {
          text-decoration: none;
        }
        .rc-pagination-item:focus,
        .rc-pagination-item:hover {
          border-color: #1890ff;
          transition: all 0.3s;
        }
        .rc-pagination-item:focus a,
        .rc-pagination-item:hover a {
          color: #1890ff;
        }
        .rc-pagination-item-active {
          font-weight: 500;
          background: #ffffff;
          border-color: #1890ff;
        }
        .rc-pagination-item-active a {
          color: #1890ff;
        }
        .rc-pagination-item-active:focus,
        .rc-pagination-item-active:hover {
          border-color: #40a9ff;
        }
        .rc-pagination-item-active:focus a,
        .rc-pagination-item-active:hover a {
          color: #40a9ff;
        }
        .rc-pagination-jump-prev,
        .rc-pagination-jump-next {
          outline: 0;
        }
        .rc-pagination-jump-prev button,
        .rc-pagination-jump-next button {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #666;
        }
        .rc-pagination-jump-prev button:after,
        .rc-pagination-jump-next button:after {
          display: block;
          content: '•••';
        }
        .rc-pagination-prev,
        .rc-pagination-jump-prev,
        .rc-pagination-jump-next {
          margin-right: 8px;
        }
        .rc-pagination-prev,
        .rc-pagination-next,
        .rc-pagination-jump-prev,
        .rc-pagination-jump-next {
          display: inline-block;
          min-width: 28px;
          height: 28px;
          color: rgba(0, 0, 0, 0.85);
          font-family: Arial;
          line-height: 28px;
          text-align: center;
          vertical-align: middle;
          list-style: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .rc-pagination-prev,
        .rc-pagination-next {
          outline: 0;
        }
        .rc-pagination-prev button,
        .rc-pagination-next button {
          color: rgba(0, 0, 0, 0.85);
          cursor: pointer;
          user-select: none;
        }
        .rc-pagination-prev:hover button,
        .rc-pagination-next:hover button {
          border-color: #40a9ff;
        }
        .rc-pagination-prev .rc-pagination-item-link,
        .rc-pagination-next .rc-pagination-item-link {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 12px;
          text-align: center;
          background-color: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          outline: none;
          transition: all 0.3s;
        }
        .rc-pagination-prev:focus .rc-pagination-item-link,
        .rc-pagination-next:focus .rc-pagination-item-link,
        .rc-pagination-prev:hover .rc-pagination-item-link,
        .rc-pagination-next:hover .rc-pagination-item-link {
          color: #1890ff;
          border-color: #1890ff;
        }
        .rc-pagination-prev button:after {
          content: '‹';
          display: block;
        }
        .rc-pagination-next button:after {
          content: '›';
          display: block;
        }
        .rc-pagination-disabled,
        .rc-pagination-disabled:hover,
        .rc-pagination-disabled:focus {
          cursor: not-allowed;
        }
        .rc-pagination-disabled .rc-pagination-item-link,
        .rc-pagination-disabled:hover .rc-pagination-item-link,
        .rc-pagination-disabled:focus .rc-pagination-item-link {
          color: rgba(0, 0, 0, 0.25);
          border-color: #d9d9d9;
          cursor: not-allowed;
        }
        .rc-pagination-slash {
          margin: 0 10px 0 5px;
        }
        .rc-pagination-options {
          display: inline-block;
          margin-left: 16px;
          vertical-align: middle;
        }
        @media all and (-ms-high-contrast: none) {
          .rc-pagination-options *::-ms-backdrop,
          .rc-pagination-options {
            vertical-align: top;
          }
        }
        .rc-pagination-options-size-changer.rc-select {
          display: inline-block;
          width: auto;
          margin-right: 8px;
        }
        .rc-pagination-options-quick-jumper {
          display: inline-block;
          height: 28px;
          line-height: 28px;
          vertical-align: top;
        }
        .rc-pagination-options-quick-jumper input {
          width: 50px;
          margin: 0 8px;
        }
        .rc-pagination-simple .rc-pagination-prev,
        .rc-pagination-simple .rc-pagination-next {
          height: 24px;
          line-height: 24px;
          vertical-align: top;
        }
        .rc-pagination-simple .rc-pagination-prev .rc-pagination-item-link,
        .rc-pagination-simple .rc-pagination-next .rc-pagination-item-link {
          height: 24px;
          background-color: transparent;
          border: 0;
        }
        .rc-pagination-simple .rc-pagination-prev .rc-pagination-item-link::after,
        .rc-pagination-simple .rc-pagination-next .rc-pagination-item-link::after {
          height: 24px;
          line-height: 24px;
        }
        .rc-pagination-simple .rc-pagination-simple-pager {
          display: inline-block;
          height: 24px;
          margin-right: 8px;
        }
        .rc-pagination-simple .rc-pagination-simple-pager input {
          box-sizing: border-box;
          height: 100%;
          margin-right: 8px;
          padding: 0 6px;
          text-align: center;
          background-color: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          outline: none;
          transition: border-color 0.3s;
        }
        .rc-pagination-simple .rc-pagination-simple-pager input:hover {
          border-color: #1890ff;
        }
        .rc-pagination.rc-pagination-disabled {
          cursor: not-allowed;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item {
          background: #f5f5f5;
          border-color: #d9d9d9;
          cursor: not-allowed;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item a {
          color: rgba(0, 0, 0, 0.25);
          background: transparent;
          border: none;
          cursor: not-allowed;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item-active {
          background: #dbdbdb;
          border-color: transparent;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item-active a {
          color: #ffffff;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item-link {
          color: rgba(0, 0, 0, 0.25);
          background: #f5f5f5;
          border-color: #d9d9d9;
          cursor: not-allowed;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item-link-icon {
          opacity: 0;
        }
        .rc-pagination.rc-pagination-disabled .rc-pagination-item-ellipsis {
          opacity: 1;
        }
        @media only screen and (max-width: 992px) {
          .rc-pagination-item-after-jump-prev,
          .rc-pagination-item-before-jump-next {
            display: none;
          }
        }
        @media only screen and (max-width: 576px) {
          .rc-pagination-options {
            display: none;
          }
        }
        
        `}
      </style>
 */