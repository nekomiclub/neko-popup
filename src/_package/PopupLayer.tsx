'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import EFKW from './components/ErrorComponents';
import { cn, IPopupNode, PopupContext, RegisterNodeArgs, ValueFromPath } from './Interfaces';



export interface IPopupLayerProps {
  children?: ReactNode | ReactNode[]

  /** @default 10000 */
  baseZIndex?: number

  /**
   * Disable body scroll when there is at least one open popup
   * 
   * @default true
   */
  disableBodyScrollOnActivePopup?: boolean
}



export const PopupLayer: FC<IPopupLayerProps> = (props) => {
  const baseZIndex = props.baseZIndex ?? 10000;
  const disableBodyScrollOnActivePopup = props.disableBodyScrollOnActivePopup ?? true;

  const [nodes, setNodes] = useState<IPopupNode[]>([]);
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const [isAnyPopupActive, setIsAnyPopupActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);



  // Handle close closest to user popup on escape & scroll
  useEffect(() => {
    // === Handle close closest popup on escape
    const controller = new AbortController();

    window.addEventListener('keydown', e => {
      const key = e.key;

      if (key === 'Escape') {
        const maxZIndex = Math.max(...nodes.filter(el => el.isOpen).map(el => el.zIndex));
        const node = nodes.find(el => el.zIndex === maxZIndex);
        if (!node || node.disabled.includes('onEscape')) return;

        // eslint-disable-next-line
        invokePopup(node.id, false);
      }
    }, { signal: controller.signal });



    // === Disable body scroll on active popup
    if (disableBodyScrollOnActivePopup) {
      let anyOpenNode = false;
      nodes.forEach(el => el.isOpen ? anyOpenNode = true : null);

      setIsScrollDisabled(anyOpenNode);
    }



    return () => {
      controller.abort();
    };
  }, [nodes]);

  // Handle isAnyPopupActive
  useEffect(() => {
    setIsAnyPopupActive(nodes.some(el => el.isOpen));
  }, [nodes]);

  // Handle body scroll
  useEffect(() => {
    if (isScrollDisabled) document.body.classList.add('neko-popup--noScroll');
    else document.body.classList.remove('neko-popup--noScroll');
  }, [isScrollDisabled]);



  /** Toggle popup state */
  function invokePopup(entityOrId: string | IPopupNode, forceState?: boolean) {
    const node = typeof entityOrId === 'string' ? nodes.find(el => el.id === entityOrId) : entityOrId;
    if (!node) throw new EFKW(typeof entityOrId === 'string' ? `Cannot find popup node with id #${entityOrId}` : `Entity is not assigned to the node`);

    const newState = forceState ?? !node.isOpen;

    // === Update node
    node.isOpen = newState;
    node.zIndex = newState ? Math.max(...nodes.map(el => el.zIndex), 0) + 1 : -1; // Make new popup invocation closer to user using larger z-index

    _updateNodeInNodes(node);
  }

  /** Update node property */
  function updateNodeProperty<K extends keyof IPopupNode>(id: string, key: K, value: ValueFromPath<IPopupNode, K>) {
    const node = nodes.find(el => el.id === id);
    if (!node) return;

    node[key] = value;

    _updateNodeInNodes(node);
  }

  /** Update node in nodes array */
  function _updateNodeInNodes(node: IPopupNode) {
    setNodes(prev => [...prev.filter(el => el.id !== node.id), node]);
  }

  /** Add new popup window to state */
  const registerNode = ({ id, isOpen, disabled }: RegisterNodeArgs) => invokePopup({ id, isOpen: false, disabled, zIndex: -1 }, isOpen);



  return <PopupContext.Provider value={{
    nodes,
    containerRef,
    invokePopup,
    registerNode,
    updateNodeProperty
  }}>
    {props.children}

    <section className={cn(`neko-popup-layer`, isAnyPopupActive && 'neko-popup-layer--active')} style={{ zIndex: baseZIndex }} ref={containerRef} />
  </PopupContext.Provider>;
};