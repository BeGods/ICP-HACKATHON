import { useEffect, useState } from "react";
import { ExternalLink, Loader, X } from "lucide-react";
import { ToggleSwitch } from "../Common/ToggleSwitch";
import { useDisableWrapper } from "../../hooks/useDisableClick";
import { ToggleBack } from "../Common/SectionToggles";
import { useStore } from "../../store/useStore";

export const ModelListLyt = ({ itm, assets }) => (
  <div className="flex flex-col gap-1 bg-black/30 rounded-xl px-3 py-2 shadow-md">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={
            itm.currency === "STAR"
              ? assets.misc.tgStar
              : itm.currency === "KAIA"
              ? assets.misc.kaia
              : assets.misc.usdt
          }
          alt="currency"
          className="w-7 h-7"
        />
        <div>
          <div className="text-white font-semibold">
            {itm.amount} {itm.currency}
          </div>
          <div className="text-secondary text-gray-400">
            {itm.walletAddress.slice(0, 12)}...
            {itm.walletAddress.slice(-6)}
          </div>
        </div>
      </div>

      {itm.status === "success" ? (
        <span className="flex items-center gap-1 text-secondary px-2 py-2 rounded-full bg-green-600/20 text-green-400">
          <ExternalLink
            onClick={(e) => {
              window.open(`https://kaiascan.io/tx/${itm.paymentId}`, "_blank");
            }}
            className="w-4 h-4"
          />
        </span>
      ) : itm.status === "failed" ? (
        <span className="flex items-center gap-1 text-secondary px-2 py-2 rounded-full bg-red-600/20 text-red-400">
          <X className="w-4 h-4" />
        </span>
      ) : (
        <span className="flex items-center gap-1 text-secondary px-2 py-2 rounded-full bg-yellow-600/20 text-yellow-400">
          <Loader className="w-4 h-4 animate-spin" />
        </span>
      )}
    </div>
  </div>
);

export const ModalSelectLyt = ({ icon, value, handleOnChange, options }) => {
  return (
    <div className="flex w-full">
      <div className="flex justify-start pt-3 font-roboto items-center font-bold text-white w-[15%]">
        {icon}
      </div>
      <div className="w-full">
        <select
          value={value}
          onChange={handleOnChange}
          className="bg-black text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary"
        >
          {options.map((ctx) => (
            <option key={ctx.code} value={ctx.code}>
              {ctx.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const ModalItemLyt = ({ label, icon, placeholder, handleClick }) => {
  const { wrapWithDisable } = useDisableWrapper();

  return (
    <div
      onClick={() => {
        if (typeof handleClick === "function") {
          wrapWithDisable(handleClick);
        }
      }}
      className="flex text-tertiary text-white text-left w-full mt-6 pl-4"
    >
      <div className="flex justify-start -ml-3">{icon}</div>
      <div className="flex justify-between w-full">
        <div className="pl-3">{label}</div>
        {placeholder}
      </div>
    </div>
  );
};

export const ModalSwitchLyt = ({ label, icon, handleToggle, isActive }) => {
  return (
    <div className="flex text-tertiary text-white text-left w-full mt-6 pl-4">
      <div className="flex justify-start -ml-3">{icon}</div>
      <div className="flex justify-between w-full">
        <div className="pl-3">{label}</div>
        <ToggleSwitch handleToggle={handleToggle} isActive={isActive} />
      </div>
    </div>
  );
};

const ModalLayout = ({ children, note }) => {
  const setShowCard = useStore((s) => s.setShowCard);

  const [animateClass, setAnimateClass] = useState("overlay-fade-in");

  const handleClose = () => {
    setAnimateClass("overlay-fade-out");
    setShowCard(null);
  };

  useEffect(() => {
    setAnimateClass("overlay-fade-in");
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-[70] ${animateClass}`}
    >
      <div className="center-section">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`flex relative modal-width bg-[#1D1D1D] rounded-primary justify-center items-center flex-col card-shadow-white p-4`}
        >
          {children}
          {/* <div
            onClick={() => {
              setShowCard(null);
            }}
            className={`absolute cursor-pointer flex w-full justify-end top-0 right-0 -mt-4 -mr-4 `}
          >
            <div className="absolute flex justify-center items-center  bg-black rounded-full w-[40px] h-[40px]">
              <div className="text-white font-roboto text-black-contour text-[1.25rem]">
                {"\u2715"}
              </div>
            </div>
          </div> */}
        </div>
        {note}
      </div>
      <div className="absolute flex flex-col justify-center items-center w-full bottom-0 mb-safeBottom pb-1">
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setShowCard(null);
          }}
          activeMyth={8}
        />
      </div>
    </div>
  );
};

export default ModalLayout;
