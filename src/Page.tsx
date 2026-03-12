import './_package/styles.scss';

import React, { useEffect, useState } from 'react';

import { PopupButton, PopupLayer, PopupWindow } from './_package';


const Page: React.FC = () => {
  const [state1, setState1] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const popupId1 = 'popup-1';
  const popupId2 = 'popup-2';



  useEffect(() => {
    setTimeout(() => {
      console.log('fdssdf');
      setIsDisabled(true);
    }, 2000);

    setTimeout(() => {
      console.log('fdss43432343df');
      setIsDisabled(false);
    }, 10000);
  }, []);



  useEffect(() => {
    console.log(`state1: `, state1);
  }, [state1]);



  return <main className="w-full h-screen bg-[#888]">
    <header className="w-full h-[70px] bg-red-400 sticky top-0"></header>

    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

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
        disabled={isDisabled}
      >
        <PopupButton popupId={popupId1}>
          Popup 1
        </PopupButton>

        <PopupButton popupId={popupId2}>
          Popup 2
        </PopupButton>
      </PopupWindow>

      <PopupWindow id={popupId2} className="w-[500px] h-[300px] bg-white" animation={'scale'}>
        <PopupButton popupId={popupId1}>
          Popup 1
        </PopupButton>

        <PopupButton popupId={popupId2}>
          Popup 2
        </PopupButton>
      </PopupWindow>
    </PopupLayer>

    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
  </main>;
};

export default Page;