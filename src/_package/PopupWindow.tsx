'use client';

import { FC, ReactNode, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useMixedState from './hooks/useMixedState';
import { cn, PopupContext, PopupWindowDisabledType, StateSetter } from './Interfaces';



export type PopupWindowAnimationType = 'fade' | 'scale' | null



export interface IPopupWindowProps {
  id: string
  children: ReactNode

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
   * Fire callback when popup is mounting
   */
  onBeforeEnter?(): void

  /** 
   * Fire callback when popup appear animation finished
   */
  onAfterEnter?(): void

  /** 
   * Fire callback when popup started hide animation
   */
  onBeforeExit?(): void

  /** 
   * Fire callback when popup become unmount
   */
  onAfterExit?(): void
}



export const PopupWindow: FC<IPopupWindowProps> = (props) => {
  const ctx = useContext(PopupContext);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useMixedState(props.isOpen ?? false, props.setIsOpen);
  const [isMounted, setIsMounted] = useState(Boolean(props.isOpen));
  const [isVisible, setIsVisible] = useState(Boolean(props.isOpen));
  const [disabled, setDisabled] = useState<PopupWindowDisabledType[]>([]);

  const layerRef = useRef<HTMLDivElement>(null);

  const animation: PopupWindowAnimationType = props.animation !== undefined ? props.animation : 'fade';



  // Handle disabled
  useLayoutEffect(() => {
    let disabled: PopupWindowDisabledType[] = [];

    if (typeof props.disabled === 'boolean') disabled = props.disabled ? ['onEscape', 'onLayer'] : [];
    else disabled = props.disabled ?? [];

    ctx.updateNodeProperty(props.id, 'disabled', disabled);
  }, [props.disabled]);



  // Mount
  useEffect(() => {
    const container = ctx.containerRef.current;
    if (!container) return console.warn(`[neko-popup]: Popup layer container is not found in DOM`);;

    setContainer(container);

    ctx.mountNode({
      id: props.id,
      isOpen: Boolean(props.isOpen),
      disabled
    });
  }, []);

  // Handle toggle node on external isOpen update
  useEffect(() => {
    // Skip if node is not mounted yet
    if (!ctx.nodes.some(el => el.id === props.id)) return;

    ctx.invokePopup(props.id, props.isOpen);
  }, [props.isOpen]);

  // Handle node sync with context
  useEffect(() => {
    const node = ctx.nodes.find(el => el.id === props.id);
    if (!node) return console.warn(`[neko-popup]: Popup node (#${props.id}) is not exist`);

    setIsOpen(node.isOpen);
    setDisabled(node.disabled);
  }, [ctx.nodes]);

  // Handle events (onBeforeEnter, etc)
  useEffect(() => {
    if (isOpen) {
      if (props.onBeforeEnter) props.onBeforeEnter();

      setIsMounted(true);

      requestAnimationFrame(() => {
        setIsVisible(true);

        if (props.onAfterEnter) props.onAfterEnter();
      });
    } else {
      setIsVisible(false);

      if (props.onBeforeExit) props.onBeforeExit();
    }
  }, [isOpen]);

  // Handle layer clicks
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return console.warn(`[neko-popup]: Popup (#${props.id}) layer is not found in DOM`);

    layer.addEventListener('mousedown', ev => {
      // Pass inbound clicks
      if ((ev.target as HTMLElement).closest('.neko-popup')) return;

      ctx.invokePopup(props.id, false);
    });
  }, [isMounted]);



  function layerOnClick() {
    if (disabled.includes('onLayer')) return;

    ctx.invokePopup(props.id, false);
  }

  function handleTransitionEnd() {
    if (!isVisible) {
      setIsMounted(false);

      if (props.onAfterExit) props.onAfterExit();
    }
  }



  if (!isMounted) return null;

  return container && createPortal(<section
    className={cn(`neko-popup-backdrop`, isVisible && 'neko-popup-backdrop--active', props.layerClassName)}
    aria-hidden={!isVisible}
    style={{ cursor: disabled.includes('onLayer') ? 'default' : 'pointer' }}
    onTransitionEnd={handleTransitionEnd}
    ref={layerRef}
  >
    <article
      id={props.id}
      className={cn(`neko-popup`, isVisible && 'neko-popup--active', animation && `neko-popup--animation_${animation}`, props.className)}
      role="dialog"
      aria-modal
      onClick={e => e.stopPropagation()}
    >
      {props.children}
    </article>
  </section>, container);
};