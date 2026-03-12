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
export type PopupWindowDisabledType = 'onEscape' | 'onLayer';
export type StateSetter<S = any> = React.Dispatch<React.SetStateAction<S>>
type PopupWindowAnimationType = 'fade' | 'scale' | null

interface IPopupLayerProps {
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

export interface IPopupButtonProps {
  popupId: string

  /** 
   * Element tag
   * 
   * @default "button"
   */
  as?: 'button' | 'div'

  disabled?: boolean
  children?: ReactNode | ReactNode[]
  className?: string
  id?: string

  onClick?(e: React.MouseEvent): void
}

interface IPopupWindowProps {
  id: string
  children: ReactNode | ReactNode[]

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
   * Popup animation duration in msec
   * 
   * @default 200
   */
  animationDuraionMs?: number

  /** 
   * Fire callback when popup invoked to open
   */
  onBeforeEnter?(): void

  /** 
   * Fire callback when popup open animation fullfilled. 
   * 
   * @see animationDuration
   */
  onAfterEnter?(): void

  /** 
   * Fire callback when popup invoked to close
   */
  onBeforeExit?(): void

  /** 
   * Fire callback when popup close animation fullfilled. 
   * 
   * @see animationDuration
   */
  onAfterExit?(): void
}
```

## ☁️ Migration Guides
- [Migration from @fullkekw/popup](./docs/migration.md#fullkekwpopup)

## ©️ License
Licensed under MIT ©️ nekomiclub 2026