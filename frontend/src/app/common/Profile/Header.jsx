import { useContext, useState } from "react";
import { MainContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import { Bell, Pencil } from "lucide-react";
import UpdateModal from "../../../components/Modals/Update";
import HeaderLayout, {
  HeadbarToggleLayout,
} from "../../../components/Layouts/HeaderLayout";

const BottomChild = () => {
  const { game, setSection } = useContext(MainContext);
  const { t } = useTranslation();
  const giftIdx = game === "fof" ? 5 : 8;

  const data = [
    {
      icon: "0",
      label: t("profile.task"),
      handleClick: () => {
        setSection(giftIdx);
      },
    },
    {
      icon: <Bell color="white" fill="white" size={30} />,
      label: "Ranking",
      handleClick: () => {
        setSection(12);
      },
    },
  ];

  return <HeadbarToggleLayout data={data} />;
};

const CenterChild = ({ userData }) => {
  const { assets, authToken, setShowCard } = useContext(MainContext);
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });
  const [error, setError] = useState(false);

  return (
    <div className="flex absolute top-0 z-50 justify-center  w-full -mt-2 pl-1.5">
      <div
        // onClick={() => {
        //   setShowCard(<UpdateModal close={() => setShowCard(null)} />);
        // }}
        className={` flex text-center overflow-hidden justify-center h-symbol-primary w-symbol-primary mt-0.5 items-center rounded-full border border-white outline-white transition-all duration-1000  relative`}
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
        <div className="absolute -bottom-1 right-0 flex justify-center items-start pt-1 bg-black/50 w-full h-[2rem] overflow-hidden cursor-pointer">
          <Pencil color="white" size={16} />
        </div>
      </div>
    </div>
  );
};

const ProfileHeader = ({ userData, avatarColor, handleClick, showGuide }) => {
  return (
    <>
      <HeaderLayout
        activeMyth={8}
        titleColor="gold"
        title={(
          userData.username.charAt(0).toUpperCase() +
          userData.username.slice(1).toLowerCase()
        ).slice(0, 12)}
        BottomChild={
          <BottomChild
            userData={userData}
            handleClick={handleClick}
            showGuide={showGuide}
          />
        }
        CenterChild={
          <CenterChild userData={userData} avatarColor={avatarColor} />
        }
      />
    </>
  );
};

export default ProfileHeader;
