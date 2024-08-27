import { ChevronRight } from "lucide-react";
import React from "react";

const ProfileCard = (props) => {
  return (
    <div className="flex gap-[8px] text-center items-center bg-black w-full p-[15px] rounded-primary">
      <div className="flex items-center gap-[20px] rounded-primary w-full">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
          alt="telegram"
          className="w-[32px] h-[32px]"
        />
        <div className="text-left">
          <h3 className="text-[14px]">Join FrogDog Games</h3>
          <p className="text-[10px]">
            +1 <span className="gradient-multi">ORBs</span>
          </p>
        </div>
      </div>
      <ChevronRight />
    </div>
  );
};

export default ProfileCard;
