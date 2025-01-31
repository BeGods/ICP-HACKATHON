import { useContext, useEffect, useState } from "react";
import { RorContext } from "../../../context/context";
import ProfileInfoCard from "../../../components/Cards/Info/ProfileInfoCrd";
import { useTranslation } from "react-i18next";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import SettingModal from "../../../components/Modals/Settings";
import { Settings } from "lucide-react";

const tele = window.Telegram?.WebApp;

const BottomChild = ({ userData, showGuide }) => {
  const { rewards, setSection, enableHaptic } = useContext(RorContext);
  const [showEffect, setShowEffect] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex h-button-primary -mt-3 absolute z-50 text-black font-symbols justify-between w-screen">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
        }}
        className="flex slide-inside-left p-0.5 justify-end items-center w-1/4 bg-white rounded-r-full"
      >
        <div
          className={`flex ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full`}
        >
          t
        </div>
      </div>
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          setSection(7);
        }}
        className="flex slide-inside-right p-0.5 justify-start items-center w-1/4 bg-white rounded-l-full"
      >
        <div
          className={`flex ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full`}
        >
          r
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[9vh] font-fof text-[17px] uppercase">
        <div className={`mr-auto slide-in-out-left`}>{t("sections.gifts")}</div>
        <div className={`ml-auto slide-in-out-right`}>Ranking</div>
      </div>
    </div>
  );
};

const CenterChild = ({ userData }) => {
  const { assets, platform, setShowCard, enableHaptic } =
    useContext(RorContext);
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });

  return (
    <div className="flex absolute top-0 justify-center z-50 left-[34vw]">
      <div
        onClick={() => {
          setShowCard(
            <SettingModal
              close={() => {
                setShowCard(null);
              }}
            />
          );
        }}
        className="flex justify-center items-center bg-black  w-[45px] h-[45px] z-50 rounded-full absolute top-0 mt-0.5 ml-[33vw]"
      >
        <Settings color="white" size={"30px"} />
      </div>
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        {/* <div
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
        </div> */}
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
