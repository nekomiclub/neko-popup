'use client';

import { FC, ReactNode, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useMixedState from './hooks/useMixedState';
import { cn, PopupContext, PopupWindowDisabledType, StateSetter } from './Interfaces';



type PopupWindowAnimationType = 'fade' | 'scale' | null



interface IPopupWindowProps {
  id: string
  children: ReactNode | ReactNode[]

  isOpen?: boolean
  setIsOpen?: StateSetter<boolean>

  className?: string
  layerClassName?: string
  disabled?: PopupWindowDisabledType[] | boolean

  /** 
   * Popup dialog animation type
   * 
   * @default "fade"
   */
  animation?: 'fade' | 'scale' | null

  /**
   * Popup animation duration in msec
   * 
   * @default 200
   */
  animationDuraionMs?: number

  /** 
   * Fire callback when popup invoked to open
   */
  onBeforeEnter?(): void

  /** 
   * Fire callback when popup open animation fullfilled. 
   * 
   * @see animationDuration
   */
  onAfterEnter?(): void

  /** 
   * Fire callback when popup invoked to close
   */
  onBeforeExit?(): void

  /** 
   * Fire callback when popup close animation fullfilled. 
   * 
   * @see animationDuration
   */
  onAfterExit?(): void
}



const PopupWindow: FC<IPopupWindowProps> = (props) => {
  const ctx = useContext(PopupContext);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useMixedState(props.isOpen ?? false, props.setIsOpen);
  const [zIndex, setZIndex] = useState(-1);
  const [disabled, setDisabled] = useState<PopupWindowDisabledType[]>([]);

  const layerRef = useRef<HTMLDivElement>(null);

  const animation: PopupWindowAnimationType = props.animation !== undefined ? props.animation : 'fade';
  const animationDuration = props.animationDuraionMs ?? 200;



  // Handle disabled
  useLayoutEffect(() => {
    let disabled: PopupWindowDisabledType[] = [];

    if (typeof props.disabled === 'boolean') disabled = props.disabled ? ['onEscape', 'onLayer'] : [];
    else disabled = props.disabled ?? [];

    ctx.updateNodeProperty(props.id, 'disabled', disabled);
  }, [props.disabled]);



  // Mount & register node
  useEffect(() => {
    const container = ctx.containerRef.current;
    if (!container) return;

    setContainer(container);

    ctx.registerNode({
      id: props.id,
      isOpen: Boolean(props.isOpen),
      disabled
    });
  }, []);

  // Handle node sync with context
  useEffect(() => {
    const node = ctx.nodes.find(el => el.id === props.id);
    if (!node) return;

    setIsOpen(node.isOpen);
    setZIndex(node.zIndex);
    setDisabled(node.disabled);
  }, [ctx.nodes]);

  // Handle layer z-index change
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    if (isOpen) layer.style.zIndex = `${zIndex}`;
    else setTimeout(() => {
      layer.style.zIndex = `${-1}`;
    }, animationDuration);
  }, [isOpen]);

  // Handle events (onBeforeEnter, etc)
  useEffect(() => {
    if (isOpen) {
      if (props.onBeforeEnter) props.onBeforeEnter();

      setTimeout(() => {
        if (props.onAfterEnter) props.onAfterEnter();
      }, animationDuration);
    } else {
      if (props.onBeforeExit) props.onBeforeExit();

      setTimeout(() => {
        if (props.onAfterExit) props.onAfterExit();
      }, animationDuration);
    }
  }, [isOpen]);



  function layerOnClick() {
    if (disabled.includes('onLayer')) return;

    ctx.invokePopup(props.id, false);
  }



  return container && createPortal(<section
    className={cn(`neko-popup-backdrop`, isOpen && 'neko-popup-backdrop--active', props.layerClassName)}
    aria-hidden={!isOpen}
    style={{ transition: `${animationDuration}ms ease-in-out`, cursor: disabled.includes('onLayer') ? 'default' : 'pointer' }}
    onClick={layerOnClick}
    ref={layerRef}
  >
    <article
      id={props.id}
      className={cn(`neko-popup`, isOpen && 'neko-popup--active', animation && `neko-popup--animation_${animation}`, props.className)}
      role="dialog"
      aria-modal
      onClick={e => e.stopPropagation()}
    >
      {props.children}
    </article>
  </section>, container);
};

export default PopupWindow;