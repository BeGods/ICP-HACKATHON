import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import GiftHeader from "./Header";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import BgLayout from "../../../components/Layouts/BgLayout";
import { PayoutCrsl, TaskCrsl, VoucherCrsl } from "./Carousels";

const Missions = () => {
  const { globalRewards, payouts, tasks, userData, setShowBack, setSection } =
    useContext(MainContext);
  const [category, setCategory] = useState(1);
  const filteredTasks = tasks.filter((itm) => !itm.isClaimed).length;
  const filteredVouchers = globalRewards.filter((itm) => !itm.isClaimed).length;
  const filteredPayouts = payouts.filter(
    (itm) => !itm.isClaimed && itm.limit > 0
  ).length;
  const categoryCntArr = [filteredVouchers, filteredTasks, filteredPayouts];

  useEffect(() => {
    setShowBack(3);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <BgLayout>
      <GiftHeader
        categoryCntArr={categoryCntArr}
        category={category}
        setCategory={(idx) => setCategory(idx)}
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
            setSection(3);
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
