import { FC, ReactNode, useContext, useEffect, useLayoutEffect, useState } from 'react';
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

  const [layer, setLayer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useMixedState(props.isOpen ?? false, props.setIsOpen);
  const [zIndex, setZIndex] = useState(-1);
  const [disabled, setDisabled] = useState<PopupWindowDisabledType[]>([]);

  const animation: PopupWindowAnimationType = props.animation !== undefined ? props.animation : 'fade';
  const animationDuration = props.animationDuraionMs ?? 200;



  // Handle disabled
  useLayoutEffect(() => {
    if (typeof props.disabled === 'boolean') setDisabled(props.disabled ? ['onEscape', 'onLayer'] : []);
    else setDisabled(props.disabled ?? []);
  }, [props.disabled]);



  // Mount & register node
  useEffect(() => {
    const layer = ctx.layerRef.current;
    if (!layer) return;

    setLayer(layer);

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
  }, [ctx.nodes]);

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



  return layer && createPortal(<section
    className={cn(`neko-popup-backdrop`, isOpen && 'neko-popup-backdrop--active', props.layerClassName)}
    aria-hidden={!isOpen}
    style={{ zIndex: zIndex, transition: `${animationDuration}ms ease-in-out`, cursor: disabled.includes('onLayer') ? 'default' : 'pointer' }}
    onClick={layerOnClick}
  >
    <article
      id={props.id}
      className={cn(`neko-popup`, isOpen && 'neko-popup--active', animation && `neko-popup--animation_${animation}`, props.className)}
      role="dialog"
      aria-modal
      onClick={e => e.stopPropagation()}
    >
      [{props.id}] isOpen: {String(isOpen)}; zIndex: {zIndex}
      <br />

      {props.children}
    </article>
  </section>, layer);
};

export default PopupWindow;