import { useState } from "react";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import BgLayout from "../../../components/Layouts/BgLayout";
import { PayoutCrsl, TaskCrsl, VoucherCrsl } from "./Carousels";
import { useStore } from "../../../store/useStore";
import HeaderLayout, {
  HeaderCategoryLayout,
} from "../../../components/Layouts/HeaderLayout";

const iconMap = [
  {
    icon: <span className="text-[1.5rem] font-symbols">1</span>,
    label: "Vouchers",
  },
  {
    icon: <span className="text-[1.5rem] font-symbols">0</span>,
    label: "Tasks",
  },
  {
    icon: <span className="text-[1.5rem] font-symbols">t</span>,
    label: "Payouts",
  },
];

const Missions = () => {
  const globalRewards = useStore((s) => s.globalRewards);
  const payouts = useStore((s) => s.payouts);
  const tasks = useStore((s) => s.tasks);
  const userData = useStore((s) => s.userData);
  const setSection = useStore((s) => s.setSection);
  const game = useStore((s) => s.game);
  const [category, setCategory] = useState(1);
  const filteredTasks = tasks.filter((itm) => !itm.isClaimed).length;
  const filteredVouchers = globalRewards.filter((itm) => !itm.isClaimed).length;
  const filteredPayouts = payouts.filter(
    (itm) => !itm.isClaimed && itm.limit > 0
  ).length;
  const categoryCntArr = [filteredVouchers, filteredTasks, filteredPayouts];
  const profileIdx = game == "fof" ? 3 : 8;

  return (
    <BgLayout>
      <HeaderLayout
        activeMyth={8}
        title={""}
        BottomChild={<></>}
        CenterChild={
          <HeaderCategoryLayout
            category={category}
            setCategory={(idx) => setCategory(idx)}
            iconMap={iconMap}
            categoryCntArr={categoryCntArr}
          />
        }
      />

      <>
        {category == 0 ? (
          <VoucherCrsl rewards={globalRewards} />
        ) : category == 1 ? (
          <TaskCrsl quests={tasks} userData={userData} />
        ) : (
          <PayoutCrsl rewards={payouts} />
        )}
      </>

      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setSection(profileIdx);
          }}
          activeMyth={8}
        />
        <ToggleLeft
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev - 1 + 3) % 3);
          }}
          activeMyth={4}
        />
        <ToggleRight
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev + 1) % 3);
          }}
          activeMyth={4}
        />
      </>
    </BgLayout>
  );
};

export default Missions;
