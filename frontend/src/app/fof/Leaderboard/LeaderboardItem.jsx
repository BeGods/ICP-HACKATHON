import React, { useContext, useEffect, useState } from "react";
import Avatar from "../../../components/Common/Avatar";
import { FofContext } from "../../../context/context";

const LeaderboardItem = ({
  rank,
  name,
  totalOrbs,
  imageUrl,
  isEmpty,
  prevRank,
  isKOL,
}) => {
  const { userData } = useContext(FofContext);
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
        rank % 2 === 0 && !isKOL ? "bg-borderGray" : ""
      } ${rank % 2 === 0 && isKOL ? "bg-black/10" : ""} ${
        isKOL ? "text-black" : "text-white"
      } font-medium text-tertiary w-[98%] h-fit mx-auto py-2`}
    >
      {isEmpty ? (
        <div className="flex w-full h-fit justify-between">
          <div className="flex justify-center items-center w-[25%] h-full"></div>
          <div className="flex gap-3 items-center  w-full">
            <div className="h-[35px] w-[35px]"></div>
            <h1></h1>
          </div>
          <div className="flex flex-col justify-center items-center text-tertiary w-[25%] h-full">
            <h1></h1>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[35px] justify-between">
          <div className="flex justify-start pl-5 items-center w-[25%] h-full">
            <h1>{rank}</h1>
            <div>
              {rank < prevRank && (
                <h1 className="text-green-500 text-[18px]">▲</h1>
              )}
              {rank > prevRank && (
                <h1 className="text-red-500 text-[18px]">▼</h1>
              )}
            </div>
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
