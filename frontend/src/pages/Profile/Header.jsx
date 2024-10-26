import { useContext } from "react";
import Header from "../../components/Common/Header";
import { MyContext } from "../../context/context";

const TopChild = ({ handleClick }) => {
  const { setSection } = useContext(MyContext);

  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div
        onClick={handleClick}
        className="flex flex-col items-end justify-between h-full mt-1 ml-[8vw] z-10"
      >
        <div className="font-symbols text-white text-[12vw] text-black-lg-contour">
          u
        </div>
      </div>
      <div
        onClick={() => {
          setSection(7);
        }}
        className="flex flex-col text-black-lg-contour items-end justify-between h-full mt-1 mr-[8vw] z-10"
      >
        <div className="font-symbols text-white text-[12vw]">r</div>
      </div>
    </div>
  );
};

const BottomChild = ({ userData }) => {
  return (
    <div className="flex bar-flipped justify-center -mt-[4vh] px-7">
      <div
        className={`flex text-num pl-3 text-black-lg-contour text-white items-center border justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {userData.overallRank === 0 ? 1 : userData.overallRank}
      </div>
      <div
        className={`flex text-num pr-3 text-black-lg-contour text-white items-center border justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        {userData.directReferralCount}
      </div>
    </div>
  );
};

const CenterChild = ({ userData }) => {
  const { assets, platform } = useContext(MyContext);
  return (
    <div className="flex absolute justify-center w-full ">
      {/* Orb */}
      <div
        onClick={() => {}}
        className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  relative`}
      >
        <img
          src={
            userData.avatarUrl
              ? `https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`
              : `${assets.uxui.baseorb}`
          }
          alt="base-orb"
          className={`filter-orbs-black w-full h-full rounded-full`}
        />
        {!userData.avatarUrl && (
          <div
            className={`z-1 flex justify-center items-start tetx-white  text-[22vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
          >
            <div
              className={`uppercase ${
                platform === "ios" ? "mt-2" : "mt-4"
              } text-white`}
            >
              {userData.telegramUsername[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileHeader = ({ userData, avatarColor, handleClick }) => {
  return (
    <Header
      BottomChild={<BottomChild userData={userData} />}
      TopChild={<TopChild handleClick={handleClick} />}
      CenterChild={
        <CenterChild userData={userData} avatarColor={avatarColor} />
      }
    />
  );
};

export default ProfileHeader;
