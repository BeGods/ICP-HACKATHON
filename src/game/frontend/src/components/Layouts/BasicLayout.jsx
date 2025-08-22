import BgLayout from "./BgLayout";

const BasicLayout = ({ TopChild, CenterChild, BottomChild }) => {
  return (
    <BgLayout>
      <div className="flex flex-col items-center justify-start w-full z-50 h-1/5">
        {TopChild}
      </div>
      <div className="center-section">{CenterChild}</div>
      <div className="bottom-base-area">{BottomChild}</div>
    </BgLayout>
  );
};

export default BasicLayout;
