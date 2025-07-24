import { useEffect, useState, useContext, useCallback, useRef } from "react";
import SettingModal from "../../../components/Modals/Settings";
import CarouselLayout, {
  ItemLayout,
} from "../../../components/Layouts/CarouselLayout";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import PayoutInfoCard from "../../../components/Cards/Info/PayoutInfoCrd";
import { useDisableWrapper } from "../../../hooks/disableWrapper";
import { useTranslation } from "react-i18next";
import { useOpenAd } from "../../../hooks/DappAds";
import { showToast } from "../../../components/Toast/Toast";
import TaskItem from "./TaskItem";

export const VoucherCrsl = ({ rewards }) => {
  const [items, setItems] = useState([]);
  const { setActiveReward, game, setSection } = useContext(MainContext);
  const redeemIdx = game === "fof" ? 6 : 14;

  useEffect(() => {
    const itemsDataMapped = rewards.map((item, idx) => (
      <ItemLayout
        key={idx}
        handleClick={() => {
          setActiveReward(item);
          setSection(redeemIdx);
        }}
        item={{
          icon: (
            <img
              src={
                item.partnerType == "playsuper"
                  ? `${item.metadata.campaignCoverImage}`
                  : `https://media.publit.io/file/Partners/160px-${item.metadata.campaignCoverImage}.bubble.png`
              }
              alt="partner"
            />
          ),
          title: item.metadata.brandName,
          desc: [
            item.metadata.campaignTitle?.length > 20
              ? item?.metadata.campaignTitle?.slice(0, 20) + "..."
              : item?.metadata.campaignTitle,
            "",
          ],
          showStatus: false,
        }}
      />
    ));

    setItems(itemsDataMapped);
  }, [rewards]);

  return <CarouselLayout extraPadd={true} items={items} />;
};

export const PayoutCrsl = ({ rewards }) => {
  const { setShowCard, assets, isTelegram } = useContext(MainContext);
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
      .map((item, idx) => (
        <ItemLayout
          key={idx}
          handleClick={() => {
            setShowCard(
              <PayoutInfoCard close={() => setShowCard(null)} data={item} />
            );
          }}
          item={{
            icon: (
              <img
                src={
                  item.paymentType?.includes("USDT")
                    ? assets.misc.usdt
                    : isTelegram
                    ? assets.misc.tgStar
                    : assets.misc.kaia
                }
                alt="token"
              />
            ),
            title:
              item?.title?.length > 14
                ? item?.title?.slice(0, 14) + "..."
                : item?.title,
            desc: [
              `+${item?.amount}`,
              `${
                item.paymentType?.includes("USDT")
                  ? "USDT"
                  : isTelegram
                  ? "STAR"
                  : "KAIA"
              }`,
            ],
            showStatus: true,
            status: item.isClaimed ? "claimed" : "",
          }}
        />
      ));

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
