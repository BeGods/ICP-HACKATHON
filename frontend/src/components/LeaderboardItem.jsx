import React from "react";

const LeaderboardItem = ({ rank, name, totalOrbs }) => {
  return (
    <div className="flex items-center justify-between text-[16px] w-full h-fit mx-auto text-white font-montserrat">
      <div className="flex justify-center items-center w-2/5 h-full">
        #{rank}
      </div>
      <div className="flex gap-4 items-center  w-full">
        <img
          src="/images/profile.png"
          alt="profile"
          className="h-[35px] w-[35px]"
        />
        <h1>{name}</h1>
      </div>
      <div className="flex flex-col justify-center items-center text-[14px] w-2/5 h-full">
        <h1>{totalOrbs}</h1>
        <h1 className="-mt-1.5">$ORBS</h1>
      </div>
    </div>
  );
};

export default LeaderboardItem;
