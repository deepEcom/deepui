import React from "react"
import KEYCODE from "./KeyCode"


class Options extends React.Component<any, any> {
  static defaultProps = {
    pageSizeOptions: ['10', '20', '50', '100'],
  }

  state = {
    goInputText: '',
  }

  getValidValue() {
    const { goInputText } = this.state;
    // @ts-expect-error
    return !goInputText || isNaN(goInputText) ? undefined : Number(goInputText);
  }

  buildOptionText = (value: any) => `${value} ${this.props.locale.items_per_page}`;

  changeSize = (value: any) => {
    this.props.changeSize(Number(value));
  };

  handleChange = (e: { target: { value: any; }; }) => {
    this.setState({
      goInputText: e.target.value,
    });
  };

  handleBlur = (e: { relatedTarget: { className: string | string[]; }; }) => {
    const { goButton, quickGo, rootPrefixCls } = this.props;
    const { goInputText } = this.state;
    if (goButton || goInputText === '') {
      return;
    }
    this.setState({
      goInputText: '',
    });
    if (
      e.relatedTarget &&
      (e.relatedTarget.className.indexOf(`${rootPrefixCls}-item-link`) >= 0 ||
        e.relatedTarget.className.indexOf(`${rootPrefixCls}-item`) >= 0)
    ) {
      return;
    }
    quickGo(this.getValidValue());
  };

  go = (e: { keyCode: number; type: string; }) => {
    const { goInputText } = this.state;
    if (goInputText === '') {
      return;
    }
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      this.setState({
        goInputText: '',
      });
      this.props.quickGo(this.getValidValue());
    }
  };

  getPageSizeOptions() {
    const { pageSize, pageSizeOptions } = this.props;
    if (
      pageSizeOptions.some(
        (option: { toString: () => any; }) => option.toString() === pageSize.toString(),
      )
    ) {
      return pageSizeOptions;
    }
    return pageSizeOptions.concat([pageSize.toString()]).sort((a: any, b: any) => {
      const numberA = isNaN(Number(a)) ? 0 : Number(a);
      const numberB = isNaN(Number(b)) ? 0 : Number(b);
      return numberA - numberB;
    });
  }

  render() {
    const {
      pageSize,
      locale,
      rootPrefixCls,
      changeSize,
      quickGo,
      goButton,
      selectComponentClass,
      buildOptionText,
      selectPrefixCls,
      disabled,
    } = this.props;
    const { goInputText } = this.state;
    const prefixCls = `${rootPrefixCls}-options`;
    const Select = selectComponentClass;
    let changeSelect = null;
    let goInput = null;
    let gotoButton = null;

    if (!changeSize && !quickGo) {
      return null;
    }

    const pageSizeOptions = this.getPageSizeOptions();

    if (changeSize && Select) {
      const options = pageSizeOptions.map((opt: { toString: () => any; }, i: React.Key | null | undefined) => (
        <Select.Option key={i} value={opt.toString()}>
          {(buildOptionText || this.buildOptionText)(opt)}
        </Select.Option>
      ));

      changeSelect = (
        <Select
          disabled={disabled}
          prefixCls={selectPrefixCls}
          showSearch={false}
          className={`${prefixCls}-size-changer`}
          optionLabelProp="children"
          dropdownMatchSelectWidth={false}
          value={(pageSize || pageSizeOptions[0]).toString()}
          onChange={this.changeSize}
          getPopupContainer={(triggerNode: { parentNode: any; }) => triggerNode.parentNode}
        >
          {options}
        </Select>
      );
    }

    if (quickGo) {
      if (goButton) {
        gotoButton =
          typeof goButton === 'boolean' ? (
            <button
              type="button"
              // @ts-ignore
              onClick={this.go}
              onKeyUp={this.go}
              disabled={disabled}
              className={`${prefixCls}-quick-jumper-button`}
            >
              {locale.jump_to_confirm}
            </button>
          ) : (
            // @ts-ignore
            <span onClick={this.go} onKeyUp={this.go}>
              {goButton}
            </span>
          );
      }
      goInput = (
        <div className={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            disabled={disabled}
            type="text"
            value={goInputText}
            onChange={this.handleChange}
            onKeyUp={this.go}
            // @ts-ignore
            onBlur={this.handleBlur}
          />
          {locale.page}
          {gotoButton}
        </div>
      );
    }

    return (
      <li className={`${prefixCls}`}>
        {changeSelect}
        {goInput}
      </li>
    );
  }
}

export default Options
