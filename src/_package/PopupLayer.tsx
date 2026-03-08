'use client';

import { FC, ReactNode, Suspense, useEffect, useRef, useState } from 'react';

import EFKW from './components/ErrorComponents';
import { IPopupNode, PopupContext, RegisterNodeArgs } from './Interfaces';



interface IPopupLayerProps {
  children?: ReactNode | ReactNode[]

  /** @default 10000 */
  baseZIndex?: number
}



const PopupLayer: FC<IPopupLayerProps> = (props) => {
  const [nodes, setNodes] = useState<IPopupNode[]>([]);

  const layerRef = useRef<HTMLDivElement>(null);

  const baseZIndex = props.baseZIndex ?? 10000;



  // Handle close closest to user popup on escape
  useEffect(() => {
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



    return () => {
      controller.abort();
    };
  }, [nodes]);



  /** Toggle popup state */
  function invokePopup(entityOrId: string | IPopupNode, forceState?: boolean) {
    const node = typeof entityOrId === 'string' ? nodes.find(el => el.id === entityOrId) : entityOrId;
    if (!node) throw new EFKW(typeof entityOrId === 'string' ? `Cannot find popup node with id #${entityOrId}` : `Entity is not assigned to the node`);

    const newState = forceState ?? !node.isOpen;

    // === Update node
    node.isOpen = newState;
    node.zIndex = newState ? Math.max(...nodes.map(el => el.zIndex), 0) + 1 : -1; // Make new popup invocation closer to user using larger z-index

    // === Update nodes
    setNodes(prev => [...prev.filter(el => el.id !== node.id), node]);
  }

  /** Add new popup window to state */
  const registerNode = ({ id, isOpen, disabled }: RegisterNodeArgs) => invokePopup({ id, isOpen: false, disabled, zIndex: -1 }, isOpen);



  return <PopupContext.Provider value={{
    nodes,
    layerRef,
    invokePopup,
    registerNode
  }}>
    {props.children}

    <Suspense>
      <section style={{ zIndex: baseZIndex }} ref={layerRef} />
    </Suspense>
  </PopupContext.Provider>;
};

export default PopupLayer;