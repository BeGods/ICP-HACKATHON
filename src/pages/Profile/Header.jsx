import { useContext } from "react";
import Header from "../../components/Common/Header";
import { MyContext } from "../../context/context";

const TopChild = ({ handleClick }) => {
  const { setSection } = useContext(MyContext);

  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div
        onClick={handleClick}
        className="flex flex-col items-end justify-between h-full mt-1 ml-[13vw] z-10"
      >
        <div className="font-symbols text-white text-[11vw] text-black-lg-contour">
          u
        </div>
      </div>
      <div
        onClick={() => {
          setSection(7);
        }}
        className="flex flex-col text-black-lg-contour items-end justify-between h-full mt-1 mr-[13vw] z-10"
      >
        <div className="font-symbols text-white text-[11vw]">r</div>
      </div>
    </div>
  );
};

const BottomChild = ({ userData }) => {
  return (
    <div className="flex justify-center -mt-[4vh]">
      <div
        className={`flex text-num pl-6 text-black-lg-contour text-white items-center border justify-start h-button-primary w-button-primary bg-black z-10 rounded-primary transform skew-x-12`}
      >
        {userData.overallRank === 0 ? 1 : userData.overallRank}
      </div>
      <div
        className={`flex text-num pr-6 text-black-lg-contour text-white items-center border justify-end h-button-primary w-button-primary bg-black z-10 rounded-primary transform -skew-x-12`}
      >
        {userData.directReferralCount}
      </div>
    </div>
  );
};

const CenterChild = ({ userData }) => {
  return (
    <div className="flex absolute justify-center w-full">
      {/* Orb */}
      <div
        onClick={() => {}}
        className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="base-orb"
          className={`filter-orbs-black w-full h-full`}
        />
        <div className="absolute flex flex-col text-center justify-center">
          <h2 className="uppercase mt-3 text-secondary text-black">
            FrogdogGames
          </h2>
          <div className="text-primary uppercase">
            {userData.telegramUsername}
          </div>
        </div>
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
