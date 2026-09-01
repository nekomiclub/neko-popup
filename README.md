# React Popup

<!-- GIFs -->

## 🎉 Installation
```bash
$ npm install neko-popup
$ pnpm install neko-popup
$ yarn add neko-popup
```

```tsx
import 'neko-popup/css';

import React from 'react';

import { PopupButton, PopupLayer, PopupWindow } from './_package';

function App() {
  const popupId1 = 'popup-1';



  return <PopupLayer>
    <PopupButton popupId={popupId1}>
      Popup 1
    </PopupButton>



    <PopupWindow
      id={popupId1}
      className="w-[500px] h-[300px] bg-white"
      animation={'fade'}
    >
      <PopupButton popupId={popupId1}>
        Popup 1
      </PopupButton>
    </PopupWindow>
    </PopupLayer>
}
```

## ✨ Features
- Active popup can be closed by pressing Escape or clicking on the backdrop
- State can be controlled by passing state/stateSetter from parent
- Built-in fade/scale popup animations
- Popups can be stacked, recently opened popup will have larger z-index 
- Popups appears on top of the html stacking context
- Implements [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- Does not break sticky elements when hiding overflow
- Hooks before/after animation start/end
- Easy open/close disable with state support
- Support nextjs client environment

<!-- ## 👀 Examples
- [Controlled state with custom popup buttons]()
- [Disabling popup & show discard changes]() -->

## ⚙️ API
```ts
type PopupWindowAnimationType = 'fade' | 'scale' | null
export type PopupWindowDisabledType = 'onEscape' | 'onLayer';

export interface IPopupLayerProps {
  /** React children */
  children?: ReactNode

  /** 
   * Base z-index of the popups container
   * 
   * @default 10000
   */
  baseZIndex?: number

  /**
   * Disable body scroll when there is at least one open popup
   * 
   * @default true
   */
  disableBodyScrollOnActivePopup?: boolean
}

export interface IPopupButtonProps {
  /** Popup id */
  popupId: string

  /** 
   * Element tag
   * 
   * @default "button"
   */
  as?: 'button' | 'div'

  /** Whether is disabled */
  disabled?: boolean

  /** Button content */
  children?: ReactNode

  /** Class name */
  className?: string

  /** Button id */
  id?: string

  /** On click handler */
  onClick?(e: React.MouseEvent): void
}

export interface IPopupWindowProps {
  /** Popip id */
  id: string

  /** Popup content */
  children: ReactNode

  /** Whether is popup open state */
  isOpen?: boolean

  /** Whether is popup open state setter */
  setIsOpen?: StateSetter<boolean>

  /** Popup window class name */
  className?: string

  /** Popup backdrop class name */
  layerClassName?: string

  /** Disable state change on specified actions or disable fully */
  disabled?: PopupWindowDisabledType[] | boolean

  /** 
   * Popup dialog animation type
   * 
   * @default "fade"
   */
  animation?: 'fade' | 'scale' | null

  /** Keep popup in the DOM and do not unmount on close */
  keep?: boolean

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
```

## ©️ License
Licensed under MIT ©️ nekomiclub 2026