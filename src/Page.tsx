import './_package/styles.scss';

import React from 'react';

import { PopupButton, PopupLayer } from './_package';
import PopupWindow from './_package/PopupWindow';



const Page: React.FC = () => {
  const popupId1 = 'popup-1';
  const popupId2 = 'popup-2';



  return <main className="w-screen h-screen bg-[#888]">
    <PopupLayer>
      <PopupButton popupId={popupId1}>
        Popup 1
      </PopupButton>

      <PopupButton popupId={popupId2}>
        Popup 2
      </PopupButton>



      <PopupWindow id={popupId1} isOpen className="w-[500px] h-[300px] bg-white">
        <PopupButton popupId={popupId1}>
          Popup 1
        </PopupButton>

      </PopupWindow>

      <PopupWindow id={popupId2} className="w-[500px] h-[300px] bg-white">
        <PopupButton popupId={popupId2}>
          Popup 2
        </PopupButton>
      </PopupWindow>
    </PopupLayer>
  </main>;
};

export default Page;