import { useEffect, useState, useContext } from "react";
import SettingModal from "../../../components/Modals/Settings";
import CarouselLayout from "../../../components/Layouts/CarouselLayout";
import TaskItem from "./TaskItem";
import PayoutItem from "./PayoutItm";
import GiftItem from "./GiftItemCrd";
import { MainContext } from "../../../context/context";

export const VoucherCrsl = ({ rewards }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsDataMapped = rewards.map((item, idx) => (
      <GiftItem key={item.id} item={item} />
    ));

    setItems(itemsDataMapped);
  }, [rewards]);

  return <CarouselLayout extraPadd={true} items={items} />;
};

export const PayoutCrsl = ({ rewards }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsDataMapped = rewards
      .sort((a, b) => {
        if (a.limit === 0 && b.limit !== 0) return 1;
        if (a.limit !== 0 && b.limit === 0) return -1;
        if (a.isClaimed !== b.isClaimed) {
          return Number(a.isClaimed) - Number(b.isClaimed);
        }
        return b.limit - a.limit;
      })
      .filter((itm) => itm.limit > 0 || itm.isClaimed)
      .map((item, idx) => <PayoutItem key={item.id} item={item} />);

    setItems(itemsDataMapped);
  }, [rewards]);

  return <CarouselLayout extraPadd={true} items={items} />;
};

export const TaskCrsl = ({ quests }) => {
  const { setShowCard } = useContext(MainContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let localQuests = [...quests];
    const exists = localQuests.some(
      (quest) => quest._id === "fjkddfakj138338huadla"
    );

    if (!exists) {
      localQuests.unshift({
        _id: "fjkddfakj138338huadla",
        questName: "invite",
        description: "Follow our official account",
        type: "https://i.postimg.cc/9ffPNzps/invite-1.png",
        link: "fgfd",
        mythology: "Other",
        status: "Active",
        requiredOrbs: {
          multiOrbs: 3,
        },
      });
    }

    const filteredItems = localQuests
      .sort((a, b) => {
        if (a._id === "fjkddfakj138338huadla") return -1;
        if (b._id === "fjkddfakj138338huadla") return 1;

        if (a.isQuestClaimed !== b.isQuestClaimed) {
          return a.isQuestClaimed - b.isQuestClaimed;
        }

        if (a.requiredOrbs.multiOrbs === 5 && b.requiredOrbs.multiOrbs !== 5)
          return -1;
        if (a.requiredOrbs.multiOrbs !== 5 && b.requiredOrbs.multiOrbs === 5)
          return 1;

        return 0;
      })
      .map((item) => (
        <TaskItem
          key={item._id}
          showWallet={() => {}}
          showSetting={() => {
            setShowCard(
              <SettingModal
                close={() => {
                  setShowCard(null);
                }}
              />
            );
          }}
          quest={item}
        />
      ));

    setItems(filteredItems);
  }, [quests]);

  return <CarouselLayout extraPadd={true} items={items} />;
};
