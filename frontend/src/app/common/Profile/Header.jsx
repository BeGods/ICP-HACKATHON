import { useContext, useEffect, useState } from "react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { Bell, Pencil } from "lucide-react";
import UpdateModal from "../../../components/Modals/Update";

const tele = window.Telegram?.WebApp;

const BottomChild = () => {
  const { enableHaptic, game } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const [showEffect, setShowEffect] = useState(true);
  const { t } = useTranslation();

  const setSection =
    game === "fof" ? fofContext.setSection : rorContext.setSection;
  const giftIdx = game === "fof" ? 5 : 8;

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex h-button-primary z-[60] -mt-[1.1rem] absolute text-black font-symbols justify-between w-screen">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          setSection(giftIdx);
        }}
        className="flex slide-header-left cursor-pointer p-0.5 justify-end items-center w-[32%] bg-white rounded-r-full"
      >
        <div
          className={`flex ${
            showEffect && "pulse-text"
          } justify-center items-centerc  bg-black text-white w-[3rem] h-[3rem] text-symbol-sm rounded-full`}
        >
          0
        </div>
      </div>
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          setSection(13);
        }}
        className="flex slide-header-right cursor-pointer p-0.5 justify-start items-center w-[32%] bg-white rounded-l-full"
      >
        <div
          className={`flex font-symbols ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black text-white w-[3rem] h-[3rem] text-symbol-sm rounded-full`}
        >
          <Bell color="white" fill="white" size={30} />
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[4rem] font-fof text-tertiary uppercase">
        <div className={`mr-auto slide-in-out-left`}>{t("profile.task")}</div>
        <div className={`ml-auto slide-in-out-right`}>Ranking</div>
      </div>
    </div>
  );
};

const CenterChild = ({ userData }) => {
  const { assets, authToken, setShowCard } = useContext(MainContext);
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });
  const [error, setError] = useState(false);

  return (
    <div className="flex absolute top-0 justify-center  w-full  -mt-2 pl-1.5">
      <div
        onClick={() => {
          setShowCard(<UpdateModal close={() => setShowCard(null)} />);
        }}
        className={`z-[60]  flex text-center glow-icon-white justify-center h-symbol-primary w-symbol-primary mt-0.5 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  relative`}
      >
        <img
          src={
            !error && userData.avatarUrl
              ? userData.avatarUrl
              : `${assets.uxui.baseOrb}`
          }
          onError={() => {
            setError(true);
          }}
          alt="base-orb"
          className={`${
            !userData.avatarUrl && `filter-orbs-${avatarColor}`
          } w-full h-full rounded-full pointer-events-none`}
        />
        {(!userData.avatarUrl || error) && (
          <div
            className={`z-1 flex justify-center items-center text-white  text-[5.5rem] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
          >
            <div className={`uppercase text-white opacity-70`}>
              {userData.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute -bottom-1 right-0 flex justify-center items-center rounded-full bg-black w-[35px] h-[35px] overflow-hidden cursor-pointer">
          <Pencil color="white" size={18} />
        </div>
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
      <div className="flex flex-col gap-[5px] pt-headTop">
        <div
          className={`font-fof w-full text-center mt-[6.5rem] absolute top-0 text-[4.5dvh] uppercase text-gold text-black-contour drop-shadow z-50`}
        >
          {(
            userData.username.charAt(0).toUpperCase() +
            userData.username.slice(1).toLowerCase()
          ).slice(0, 12)}
        </div>
        {/* <div
          className={`text-sectionHead -mt-2.5 text-center top-0 text-white text-black-lg-contour  absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText ? (
            <div className="uppercase">{t("profile.task")}</div>
          ) : (
            <div className="text-gold">
              {(
                userData.username.charAt(0).toUpperCase() +
                userData.username.slice(1).toLowerCase()
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
