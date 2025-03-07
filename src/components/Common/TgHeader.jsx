import React, { useContext } from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const TgHeader = ({ openSettings, hideExit }) => {
  const { enableHaptic, isTelegram } = useContext(MainContext);
  const navigate = useNavigate();

  return (
    <div
      className={`absolute flex gap-x-5 ${
        isTelegram ? "right-[94px] top-[-35px]" : "right-[20px] top-[-32px]"
      } text-white z-50`}
    >
      {!hideExit && (
        <LogOut
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            navigate("/");
          }}
        />
      )}
      <Settings
        size={"6vw"}
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          openSettings();
        }}
      />
    </div>
  );
};

export default TgHeader;
