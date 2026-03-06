import React, { createContext, RefObject } from 'react';
import clsx from 'clsx';



export interface IRegisterNodeArgs {
  id: string
  isOpen: boolean
}

export interface IPopupContext {
  nodes: IPopupNode[]
  layerRef: RefObject<HTMLDivElement | null>

  invokePopup(id: string): void
  registerNode(args: IRegisterNodeArgs): void
}

export interface IPopupNode {
  id: string
  isOpen: boolean
  zIndex: number
}



export type StateSetter<S = any> = React.Dispatch<React.SetStateAction<S>>



export const PopupContext = createContext<IPopupContext>({} as IPopupContext);
export const cn = clsx;