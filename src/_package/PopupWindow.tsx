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
}



const PopupWindow: FC<IPopupWindowProps> = (props) => {
  const ctx = useContext(PopupContext);

  const [layer, setLayer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useMixedState(props.isOpen ?? false, props.setIsOpen);
  const [zIndex, setZIndex] = useState(-1);



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



  return layer && createPortal(<section
    className={cn(`neko-popup-backdrop`, isOpen && 'neko-popup-backdrop--active', props.layerClassName)}
    aria-hidden={!isOpen}
    style={{ zIndex: zIndex }}
  >
    <article
      id={props.id}
      className={cn(`neko-popup`, isOpen && 'neko-popup--active', props.className)}
      role="dialog"
      aria-modal
    >
      [{props.id}] isOpen: {String(isOpen)}; zIndex: {zIndex}

      {props.children}
    </article>
  </section>, layer);
};

export default PopupWindow;