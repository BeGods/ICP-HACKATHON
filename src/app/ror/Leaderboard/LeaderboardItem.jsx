import { useEffect, useState } from "react";
import Avatar from "../../../components/Common/Avatar";
import { useStore } from "../../../store/useStore";

const LeaderboardItem = ({
  rank,
  name,
  totalOrbs,
  imageUrl,
  isEmpty,
  prevRank,
}) => {
  const userData = useStore((s) => s.userData);

  const [avatarColor, setAvatarColor] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (name === userData.username) {
      setAvatarColor(localStorage.getItem("avatarColor"));
    }
  }, []);

  return (
    <div
      key={rank}
      className={`flex items-center ${rank % 2 === 0 ? "bg-borderGray" : ""} ${
        rank % 2 === 0 ? "bg-black/10" : ""
      }  font-medium text-tertiary text-white w-[98%] h-fit mx-auto py-1`}
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

            {prevRank !== null && (
              <div>
                {rank < prevRank && (
                  <h1 className="text-green-500 text-[18px]">▲</h1>
                )}
                {rank > prevRank && (
                  <h1 className="text-red-500 text-[18px]">▼</h1>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 items-center  w-full">
            <div className="h-[30px] w-[30px]">
              {imageUrl && !error ? (
                <img
                  src={imageUrl}
                  onError={() => {
                    setError(true);
                  }}
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
            <h1>{name}</h1>
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
