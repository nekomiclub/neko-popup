'use client';

import { FC, JSX, ReactNode, useContext, useEffect, useState } from 'react';

import { cn, PopupContext } from './Interfaces';



export interface IPopupButtonProps {
  popupId: string

  /** 
   * Element tag
   * 
   * @default "button"
   */
  as?: 'button' | 'div'

  disabled?: boolean
  children?: ReactNode | ReactNode[]
  className?: string
  id?: string

  onClick?(e: React.MouseEvent): void
}



const PopupButton: FC<IPopupButtonProps> = (props) => {
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

export default PopupButton;