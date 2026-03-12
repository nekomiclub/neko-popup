import React, { createContext, RefObject } from 'react';
import clsx from 'clsx';




export type PopupWindowDisabledType = 'onEscape' | 'onLayer';
export type StateSetter<S = any> = React.Dispatch<React.SetStateAction<S>>
export type RegisterNodeArgs = Pick<IPopupNode, 'id' | 'isOpen' | 'disabled'>

/** Get value type from nested object path */
export type ValueFromPath<T, P> =
  P extends `${infer K}.${infer R}`
  ? K extends keyof T
  ? R extends keyof T[K]
  ? T[K][R]
  : never
  : never
  : P extends keyof T
  ? T[P]
  : never;



export interface IPopupNode {
  id: string
  isOpen: boolean
  zIndex: number
  disabled: PopupWindowDisabledType[]
}

export interface IPopupContext {
  nodes: IPopupNode[]
  containerRef: RefObject<HTMLDivElement | null>

  invokePopup(id: string, forceState?: boolean): void
  registerNode(args: RegisterNodeArgs): void
  updateNodeProperty<K extends keyof IPopupNode>(id: string, key: K, value: ValueFromPath<IPopupNode, K>): void
}



export const PopupContext = createContext<IPopupContext>({} as IPopupContext);
export const cn = clsx;