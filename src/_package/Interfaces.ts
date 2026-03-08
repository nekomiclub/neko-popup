import React, { createContext, RefObject } from 'react';
import clsx from 'clsx';




export type PopupWindowDisabledType = 'onEscape' | 'onLayer';
export type RegisterNodeArgs = Pick<IPopupNode, 'id' | 'isOpen' | 'disabled'>
export type StateSetter<S = any> = React.Dispatch<React.SetStateAction<S>>



export interface IPopupNode {
  id: string
  isOpen: boolean
  zIndex: number
  disabled: PopupWindowDisabledType[]
}

export interface IPopupContext {
  nodes: IPopupNode[]
  layerRef: RefObject<HTMLDivElement | null>

  invokePopup(id: string, forceState?: boolean): void
  registerNode(args: RegisterNodeArgs): void
}



export const PopupContext = createContext<IPopupContext>({} as IPopupContext);
export const cn = clsx;