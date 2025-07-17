import HeaderLayout, {
  HeadbarToggleLayout,
} from "../../../components/Layouts/HeaderLayout";

const BottomChild = ({ pieces, currIndex }) => {
  const data = [
    {
      icon: "1",
      label: "UNCLAIMED",
      handleClick: () => {},
    },
    {
      icon: "4",
      label: "CLAIMED",
      handleClick: () => {},
    },
  ];
  return <HeadbarToggleLayout data={data} />;
};

const CenterChild = ({ name, bubble, action, link }) => {
  return (
    <div className="flex absolute justify-center w-full top-0  z-20">
      <div
        onClick={link}
        className={`z-20 bg-white flex text-center glow-icon-white justify-center h-symbol-primary w-symbol-primary mt-1 items-center rounded-full border border-white outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src={bubble}
          alt="base-orb"
          className={`filter-orbs-black w-full pointer-events-none`}
        />
      </div>
    </div>
  );
};

const RedeemHeader = ({ pieces, name, bubble, action, currIndex, link }) => {
  return (
    <HeaderLayout
      activeMyth={8}
      title={""}
      BottomChild={<BottomChild pieces={pieces} currIndex={currIndex} />}
      CenterChild={
        <CenterChild link={link} bubble={bubble} name={name} action={action} />
      }
    />
  );
};

export default RedeemHeader;
