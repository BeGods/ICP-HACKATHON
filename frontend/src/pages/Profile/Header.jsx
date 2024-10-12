import { useContext } from "react";
import Header from "../../components/Common/Header";
import { MyContext } from "../../context/context";

const TopChild = () => {
  const { setSection } = useContext(MyContext);

  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div className="flex flex-col items-end justify-between h-full mt-1 ml-[13vw] z-10">
        <div className="font-symbols text-white text-[11vw]">u</div>
      </div>
      <div
        onClick={() => {
          setSection(7);
        }}
        className="flex flex-col items-end justify-between h-full mt-1 mr-[13vw] z-10"
      >
        <div className="font-symbols text-white text-[11vw]">r</div>
      </div>
    </div>
  );
};

const BottomChild = () => {
  return (
    <div className="absolute flex w-full justify-between bottom-0 z-50 mb-[2vh]">
      <div
        className={`text-num transition-all italic text-black-lg-contour custom-skew ml-[13vw]  duration-1000 text-white`}
      >
        1
      </div>
      <div
        className={`text-num text-black-lg-contour transition-all text-right mr-[13vw] italic -rotate-6 duration-1000 text-white`}
      >
        2
      </div>
    </div>
  );
};

const CenterChild = ({ userData, avatarColor, t }) => {
  return (
    <div className="flex absolute justify-center w-full z-20">
      <div
        className={`h-[36vw] flex justify-center mt-0.5 items-center relative text-white w-[36vw] ${avatarColor} rounded-full`}
      >
        <div className="absolute flex flex-col text-center justify-center">
          <h2 className="uppercase mt-3 text-secondary text-black">
            {t(`main.fdg`)}
          </h2>
          <div className="text-primary uppercase">
            {userData.telegramUsername}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileHeader = ({ userData, avatarColor, handleSection, t }) => {
  return (
    <Header
      BottomChild={<BottomChild />}
      TopChild={<TopChild />}
      CenterChild={
        <CenterChild userData={userData} avatarColor={avatarColor} t={t} />
      }
    />
  );
};

export default ProfileHeader;
