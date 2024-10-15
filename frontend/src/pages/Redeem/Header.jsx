import Header from "../../components/Common/Header";
import { Ticket, TicketCheck } from "lucide-react";

const TopChild = () => {
  return (
    <div className="absolute flex w-full items-center justify-between top-0 z-50">
      <div className="flex flex-col items-end justify-between h-full mt-1 ml-[13vw] z-10">
        <Ticket color="white" size={"13vw"} />
      </div>
      <div className="flex flex-col text-black-lg-contour items-end h-full mr-[13vw] z-10">
        <TicketCheck color="white" size={"13vw"} />
      </div>
    </div>
  );
};

const BottomChild = ({ pieces }) => {
  return (
    <div className="flex justify-center -mt-[4vh]">
      <div
        className={`flex text-num pl-6 text-black-lg-contour text-white items-center border justify-start h-button-primary w-button-primary bg-black z-10 rounded-primary transform skew-x-12`}
      >
        1
      </div>
      <div
        className={`flex text-num pr-6 text-black-lg-contour text-white items-center border justify-end h-button-primary w-button-primary bg-black z-10 rounded-primary transform -skew-x-12`}
      >
        {pieces}/12
      </div>
    </div>
  );
};

const CenterChild = ({ name }) => {
  return (
    <div className="flex absolute justify-center w-full">
      {/* Orb */}
      <div
        className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="base-orb"
          className={`filter-orbs-black w-full h-full`}
        />
        <div className="absolute flex flex-col text-center justify-center w-[80%]">
          <div className="text-primary uppercase">{name}</div>
        </div>
      </div>
    </div>
  );
};

const RedeemHeader = ({ pieces, name }) => {
  return (
    <Header
      BottomChild={<BottomChild pieces={pieces} />}
      TopChild={<TopChild />}
      CenterChild={<CenterChild name={name} />}
    />
  );
};

export default RedeemHeader;
