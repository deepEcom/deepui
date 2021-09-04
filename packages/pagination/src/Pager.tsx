import React from "react";
import { cx } from "@deepui/utils";

const Pager = (props: any) => {
  const prefixCls = `${props.rootPrefixCls}-item`;
  const cls = cx(prefixCls, props.active && 'selected', `${prefixCls}-${props.page}`, {
    [`${prefixCls}-active`]: props.active,
    [`${prefixCls}-disabled`]: !props.page,
    [props.className]: !!props.className,
  });

  const handleClick = () => {
    props.onClick(props.page);
  };

  const handleKeyPress = (e: any) => {
    props.onKeyPress(e, props.onClick, props.page);
  };

  return (
    <li
      title={props.showTitle ? props.page : null}
      className={cls}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      data-color={props.color || ''}
      data-active-color={props.active && props.color || ''}
      // @ts-ignore
      tabIndex="0"
    >
      {props.itemRender(props.page, 'page', <a rel="nofollow">{props.page}</a>)}
    </li>
  );
};

export default Pager;