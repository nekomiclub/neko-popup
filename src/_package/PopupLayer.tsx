'use client';

import { FC, ReactNode, Suspense, useRef, useState } from 'react';

import EFKW from './components/ErrorComponents';
import { IPopupNode, IRegisterNodeArgs, PopupContext } from './Interfaces';



interface IPopupLayerProps {
  /** @default 10000 */
  baseZIndex?: number
  children?: ReactNode | ReactNode[]
}



const PopupLayer: FC<IPopupLayerProps> = (props) => {
  const [nodes, setNodes] = useState<IPopupNode[]>([]);

  const layerRef = useRef<HTMLDivElement>(null);

  const baseZIndex = props.baseZIndex ?? 10000;



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
  function registerNode({ id, isOpen }: IRegisterNodeArgs) {
    const node: IPopupNode = {
      id,
      isOpen: false,
      zIndex: -1
    };

    setNodes(prev => [...prev, node]);

    // Invoke popup if it is open initially
    if (isOpen) invokePopup(node, isOpen);
  }



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