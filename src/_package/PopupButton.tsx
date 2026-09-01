'use client';

import { FC, JSX, ReactNode, useContext, useEffect, useState } from 'react';

import { cn, PopupContext } from './Interfaces';



export interface IPopupButtonProps {
  /** Popup id */
  popupId: string

  /** 
   * Element tag
   * 
   * @default "button"
   */
  as?: 'button' | 'div'

  /** Whether is disabled */
  disabled?: boolean

  /** Button content */
  children?: ReactNode

  /** Class name */
  className?: string

  /** Button id */
  id?: string

  /** On click handler */
  onClick?(e: React.MouseEvent): void
}



/**
 * Button to natively change popup state
 * 
 * @requires PopupLayer context
 */
export const PopupButton: FC<IPopupButtonProps> = (props) => {
  const ctx = useContext(PopupContext);

  const [isActive, setIsActive] = useState(false);

  const Tag: keyof JSX.IntrinsicElements = props.as ?? 'button';



  // Handle isActive on context change
  useEffect(() => {
    const node = ctx.nodes.find(el => el.id === props.popupId);
    if (!node) return;

    setIsActive(node.isOpen);
  }, [ctx]);



  function invokePopup(e: React.MouseEvent) {
    ctx.invokePopup(props.popupId);

    if (props.onClick) props.onClick(e);
  }



  return <Tag
    tabIndex={0}
    disabled={props.disabled}
    aria-disabled={props.disabled}
    aria-haspopup={'dialog'}
    id={props.id}
    className={cn(`neko-popup-button`, isActive && 'neko-popup-button--active', props.className)}
    onClick={invokePopup}
  >
    {props.children}
  </Tag>;
};