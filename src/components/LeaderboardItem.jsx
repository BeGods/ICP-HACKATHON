import React, { useContext, useEffect, useState } from "react";
import Avatar from "../components/Common/Avatar";
import { MyContext } from "../context/context";

const LeaderboardItem = ({ rank, name, totalOrbs }) => {
  const { userData } = useContext(MyContext);
  const [avatarColor, setAvatarColor] = useState(null);

  useEffect(() => {
    if (name === userData.telegramUsername) {
      setAvatarColor(localStorage.getItem("avatarColor"));
    }
  }, []);

  return (
    <div className="flex items-center justify-between text-tertiary w-full h-fit mx-auto text-white mt-2">
      <div className="flex justify-center items-center w-2/5 h-full">
        {rank}
      </div>
      <div className="flex gap-4 items-center  w-full">
        <div className="h-[35px] w-[35px]">
          <Avatar
            name={name}
            className="h-full w-full"
            profile={0}
            color={avatarColor}
          />
        </div>
        <h1>{name}</h1>
      </div>
      <div className="flex flex-col justify-center items-center text-tertiary w-2/5 h-full">
        <h1>{parseFloat(totalOrbs.toFixed(3))}</h1>
      </div>
    </div>
  );
};

export default LeaderboardItem;
