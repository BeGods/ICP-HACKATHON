import React from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TgHeader = ({ openSettings, hideExit }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute flex gap-x-5 top-[-35px] right-[94px] text-white z-50">
      {!hideExit && (
        <LogOut
          onClick={() => {
            navigate("/");
          }}
        />
      )}
      <Settings size={"6vw"} onClick={openSettings} />
    </div>
  );
};

export default TgHeader;
