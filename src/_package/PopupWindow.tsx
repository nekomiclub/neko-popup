import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import useMixedState from './hooks/useMixedState';
import { cn, PopupContext, StateSetter } from './Interfaces';



interface IPopupWindowProps {
  id: string
  children: ReactNode | ReactNode[]

  isOpen?: boolean
  setIsOpen?: StateSetter<boolean>

  className?: string
  layerClassName?: string

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

  /** Fire callback when popup invoked to open */
  onBeforeEnter?(): void

  /** Fire callback when popup open animation fullfilled. @see animationDuration */
  onAfterEnter?(): void

  /** Fire callback when popup invoked to close */
  onBeforeExit?(): void

  /** Fire callback when popup close animation fullfilled. @see animationDuration */
  onAfterExit?(): void
}

type PopupWindowAnimationType = 'fade' | 'scale' | null



const PopupWindow: FC<IPopupWindowProps> = (props) => {
  const ctx = useContext(PopupContext);

  const [layer, setLayer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useMixedState(props.isOpen ?? false, props.setIsOpen);
  const [zIndex, setZIndex] = useState(-1);

  const animation: PopupWindowAnimationType = props.animation !== undefined ? props.animation : 'fade';
  const animationDuration = props.animationDuraionMs ?? 200;



  // Mount
  useEffect(() => {
    const layer = ctx.layerRef.current;
    if (!layer) return;

    setLayer(layer);

    ctx.registerNode({
      id: props.id,
      isOpen: Boolean(props.isOpen)
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



  return layer && createPortal(<section
    className={cn(`neko-popup-backdrop`, isOpen && 'neko-popup-backdrop--active', props.layerClassName)}
    aria-hidden={!isOpen}
    style={{ zIndex: zIndex, transition: `${animationDuration}ms ease-in-out` }}
  >
    <article
      id={props.id}
      className={cn(`neko-popup`, isOpen && 'neko-popup--active', animation && `neko-popup--animation_${animation}`, props.className)}
      role="dialog"
      aria-modal
    >
      [{props.id}] isOpen: {String(isOpen)}; zIndex: {zIndex}

      {props.children}
    </article>
  </section>, layer);
};

export default PopupWindow;