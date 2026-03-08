import './_package/styles.scss';

import React, { useEffect, useState } from 'react';

import { PopupButton, PopupLayer } from './_package';
import PopupWindow from './_package/PopupWindow';



const Page: React.FC = () => {
  const [state1, setState1] = useState(false);

  const popupId1 = 'popup-1';
  const popupId2 = 'popup-2';



  useEffect(() => {
    console.log(`state1: `, state1);
  }, [state1]);



  function onBeforeEnter() {
    console.log(`Popup 1 animation enter`);
  }

  function onAfterEnter() {
    console.log(`Popup 1 animation entered`);
  }

  function onBeforeExit() {
    console.log(`Popup 1 animation close`);
  }

  function onAfterExit() {
    console.log(`Popup 1 animation closed`);
  }



  return <main className="w-screen h-screen bg-[#888]">
    <PopupLayer>
      <PopupButton popupId={popupId1}>
        Popup 1
      </PopupButton>

      <PopupButton popupId={popupId2}>
        Popup 2
      </PopupButton>



      <PopupWindow
        id={popupId1}
        isOpen={state1}
        setIsOpen={setState1}
        className="w-[500px] h-[300px] bg-white"
        animation={'fade'}
        onBeforeEnter={onBeforeEnter}
        onAfterEnter={onAfterEnter}
        onBeforeExit={onBeforeExit}
        onAfterExit={onAfterExit}
      >
        <PopupButton popupId={popupId1}>
          Popup 1
        </PopupButton>

      </PopupWindow>

      <PopupWindow id={popupId2} className="w-[500px] h-[300px] bg-white" animation={'scale'}>
        <PopupButton popupId={popupId2}>
          Popup 2
        </PopupButton>
      </PopupWindow>
    </PopupLayer>
  </main>;
};

export default Page;