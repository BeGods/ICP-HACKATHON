import React, { useContext, useEffect, useState } from "react";
import Avatar from "../../components/Common/Avatar";
import { MyContext } from "../../context/context";
import { formatRankOrbs } from "../../helpers/leaderboard.helper";

const LeaderboardItem = ({ rank, name, totalOrbs, imageUrl, isEmpty }) => {
  const { userData } = useContext(MyContext);
  const [avatarColor, setAvatarColor] = useState(null);

  useEffect(() => {
    if (name === userData.telegramUsername) {
      setAvatarColor(localStorage.getItem("avatarColor"));
    }
  }, []);

  return (
    <div
      key={rank}
      className={`flex items-center ${
        rank % 2 === 0 ? "bg-borderGray" : ""
      } font-medium text-tertiary w-[98%] h-fit mx-auto text-white py-2`}
    >
      {isEmpty ? (
        <div className="flex w-full h-fit justify-between">
          <div className="flex justify-center items-center w-[20%] h-full"></div>
          <div className="flex gap-3 items-center  w-full">
            <div className="h-[35px] w-[35px]"></div>
            <h1></h1>
          </div>
          <div className="flex flex-col justify-center items-center text-tertiary w-[25%] h-full">
            <h1></h1>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-fit justify-between">
          <div className="flex justify-center items-center w-[20%] h-full">
            {rank}
          </div>
          <div className="flex gap-3 items-center  w-full">
            <div className="h-[35px] w-[35px]">
              {imageUrl ? (
                <img
                  src={`https://media.publit.io/file/UserAvatars/${imageUrl}.jpg`}
                  alt="profile-image"
                  className="rounded-full"
                />
              ) : (
                <Avatar
                  name={name}
                  className="h-full w-full"
                  profile={0}
                  color={avatarColor}
                />
              )}
            </div>
            <h1>{name.length > 20 ? name.slice(0, 20) : name}</h1>
          </div>
          <div className="flex flex-col justify-center items-center text-tertiary w-[25%] h-full">
            <h1>{totalOrbs}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardItem;
