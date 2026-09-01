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
  onAfterEnter?(ev: React.TransitionEvent): void

  /** 
   * Fire callback when popup started hide animation or at initial mount
   */
  onBeforeExit?(): void

  /** 
   * Fire callback when popup become unmount
   */
  onAfterExit?(ev: React.TransitionEvent): void
}



export const PopupWindow: FC<IPopupWindowProps> = (props) => {
  const ctx = useContext(PopupContext);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useMixedState(props.isOpen ?? false, props.setIsOpen);
  const [isMounted, setIsMounted] = useState(Boolean(props.isOpen));
  const [isVisible, setIsVisible] = useState(Boolean(props.isOpen));
  const [disabled, setDisabled] = useState<PopupWindowDisabledType[]>([]);

  const layerRef = useRef<HTMLDivElement>(null);
  const isAnimationFinished = useRef(true);

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
    if (!container) return;

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
    if (!node) return;

    setIsOpen(node.isOpen);
    setDisabled(node.disabled);
  }, [ctx.nodes]);

  // Handle events on open moun and on close animation exit
  useEffect(() => {
    isAnimationFinished.current = false;

    if (isOpen) {
      // On Before Enter
      if (props.onBeforeEnter) props.onBeforeEnter();

      setIsMounted(true);
    } else {
      // On Before Exit
      if (props.onBeforeExit) props.onBeforeExit();

      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle layer clicks
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    layer.addEventListener('mousedown', ev => {
      // Pass inbound clicks
      if ((ev.target as HTMLElement).closest('.neko-popup')) return;

      ctx.invokePopup(props.id, false);
    });
  }, [isMounted]);



  useLayoutEffect(() => {
    if (!isMounted || !isOpen) return;

    const id = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(id);
  }, [isMounted, isOpen]);



  function handleTransitionEnd(ev: React.TransitionEvent) {
    // Skip buble events
    if (!(ev.target as HTMLElement).className.includes('neko-popup-backdrop')) return;

    // On After Enter
    if (isVisible && isOpen) {
      if (props.onAfterEnter && !isAnimationFinished.current) props.onAfterEnter(ev);
    }

    // On After Exit
    if (!isVisible && !isOpen) {
      if (props.onAfterExit && !isAnimationFinished.current) props.onAfterExit(ev);

      setIsMounted(false);
    }

    isAnimationFinished.current = true;
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