import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { formatTwoNums } from "../../helpers/leaderboard.helper";
import ProfileInfoCard from "../../components/Cards/Info/ProfileInfoCrd";
import { useTranslation } from "react-i18next";

const BottomChild = ({ userData, showGuide }) => {
  const { rewards, setSection } = useContext(MyContext);

  return (
    <div className="flex relative justify-center px-2 -mt-3">
      <div className="flex w-full px-7">
        <div
          className={`flex broder  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary pl-headSides">
            {formatTwoNums(rewards?.length ?? 0)}
          </div>
        </div>
        <div
          className={`flex justify-end  border gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black w-full`}
        >
          <div className="text-primary pr-headSides">
            {userData?.overallRank === 0 ? 1 : userData?.overallRank}
          </div>
        </div>
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4">
        <div
          onClick={() => {
            setSection(5);
          }}
          className={`font-symbols  ${
            showGuide === 1 && "tut-shake"
          } text-iconLg text-black-lg-contour text-white z-50`}
        >
          t
        </div>
        <div
          onClick={() => {
            setSection(7);
          }}
          className={`font-symbols text-iconLg text-black-contour z-50 text-white`}
        >
          r
        </div>
      </div>
    </div>
  );
};

const CenterChild = ({ userData }) => {
  const { assets, platform, setShowCard } = useContext(MyContext);
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });

  return (
    <div className="flex absolute top-0 -mt-1 justify-center w-full">
      <div
        onClick={() => {
          setShowCard(
            <ProfileInfoCard
              close={() => {
                setShowCard(null);
              }}
            />
          );
        }}
        className={`z-20 flex text-center glow-icon-white justify-center h-symbol-primary w-symbol-primary mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  relative`}
      >
        <img
          src={
            userData.avatarUrl
              ? `https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`
              : `${assets.uxui.baseorb}`
          }
          alt="base-orb"
          className={`${
            !userData.avatarUrl && `filter-orbs-${avatarColor}`
          } w-full h-full rounded-full pointer-events-none`}
        />
        {!userData.avatarUrl && (
          <div
            className={`z-1 flex justify-center items-start text-white  text-[22vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
          >
            <div
              className={`uppercase ${
                platform === "ios" ? "mt-2" : "mt-4"
              } text-white opacity-70`}
            >
              {userData.telegramUsername[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileHeader = ({ userData, avatarColor, handleClick, showGuide }) => {
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        <div
          className={`text-sectionHead -mt-2.5 text-center top-0 text-white text-black-lg-contour  absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText ? (
            <div className="uppercase">{t("profile.task")}</div>
          ) : (
            <div className="text-gold">
              {(
                userData.telegramUsername.charAt(0).toUpperCase() +
                userData.telegramUsername.slice(1).toLowerCase()
              ).slice(0, 12)}
            </div>
          )}
        </div>
        <BottomChild
          userData={userData}
          handleClick={handleClick}
          showGuide={showGuide}
        />
        <CenterChild userData={userData} avatarColor={avatarColor} />
      </div>
    </div>
  );
};

export default ProfileHeader;
