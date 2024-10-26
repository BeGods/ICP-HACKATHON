import Header from "../../components/Common/Header";
import { Ticket, TicketCheck } from "lucide-react";

const TopChild = () => {
  return (
    <div className="absolute flex w-full items-center justify-between top-0 z-50">
      <div className="flex flex-col items-end justify-between h-full mt-1 ml-[8vw] z-10">
        <div className="font-symbols text-white text-[12vw] text-black-lg-contour">
          1
        </div>
      </div>
      <div className="flex flex-col text-black-lg-contour items-end justify-between h-full mt-1 mr-[8vw] z-10">
        <div className="font-symbols text-white text-[12vw]">4 </div>
      </div>
    </div>
  );
};

const BottomChild = ({ pieces }) => {
  return (
    <div className="flex bar-flipped justify-center -mt-[4vh] px-7">
      <div
        className={`flex text-num pl-3 text-black-lg-contour text-white items-center border  justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        1
      </div>
      <div
        className={`flex text-num pr-3 text-black-lg-contour text-white items-center border  justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        {pieces}/12
      </div>
    </div>
  );
};

const CenterChild = ({ name, bubble, action }) => {
  return (
    <div onClick={action} className="flex absolute justify-center w-full">
      {/* Orb */}
      <div
        className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src={`/assets/partners/160px-${bubble}.bubble.png`}
          alt="base-orb"
          className={`filter-orbs-black w-full h-full`}
        />
      </div>
    </div>
  );
};

const RedeemHeader = ({ pieces, name, bubble, action }) => {
  return (
    <Header
      RedeemHead={name}
      BottomChild={<BottomChild pieces={pieces} />}
      TopChild={<TopChild />}
      CenterChild={<CenterChild bubble={bubble} name={name} action={action} />}
    />
  );
};

export default RedeemHeader;
