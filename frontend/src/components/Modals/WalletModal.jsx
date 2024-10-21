import React from "react";
import IconBtn from "../Buttons/IconBtn";
import { Minus } from "lucide-react";

const WalletModal = ({ userData, close, disconnect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div className="flex relative w-[72%] bg-[#1D1D1D] rounded-primary items-center flex-col -mt-[28vh] card-shadow-white p-4">
        <IconBtn align={0} handleClick={close} activeMyth={3} />
        <div className="flex flex-col items-start gap-1 font-medium w-full mt-4 text-white">
          <div className="flex items-center gap-1">
            <div>
              <img
                src="/assets/uxui/ton.png"
                alt="ton"
                className="bg-white rounded-full h-6 w-6"
              />
            </div>
            <div className="text-tertiary">Ton Wallet</div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="w-full p-2 bg-black h-full flex items-center">
              {userData.tonAddress.length > 10
                ? `${userData.tonAddress.slice(0, 26)}...`
                : userData.tonAddress}
            </div>
            <div
              onClick={() => {
                disconnect();
                close();
              }}
              className="flex items-center bg-white p-1 rounded-md"
            >
              <Minus color="black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
