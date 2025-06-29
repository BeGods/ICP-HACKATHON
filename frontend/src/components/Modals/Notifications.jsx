import React, { useContext } from "react";
import { MainContext } from "../../context/context";
import { X } from "lucide-react";

const tele = window.Telegram?.WebApp;

const NotificationsModal = ({ handleClose }) => {
  return (
    <div
      onClick={() => handleClose()}
      className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col pt-[45%] z-50"
    >
      <div className="flex flex-col gap-y-2 w-full">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex relative notif-width w-fit h-[90px] -mt-[2.5rem] bg-white rounded-[10px] justify-center items-center flex-col p-4`}
        ></div>
      </div>

      <div className="absolute flex justify-center bottom-[5dvh] w-full">
        <X size={35} color="white" />
      </div>
    </div>
  );
};

export default NotificationsModal;
