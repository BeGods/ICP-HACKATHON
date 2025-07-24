import React, { useContext, useEffect, useState } from "react";
import "../../../styles/carousel.scss";
import { RorContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import CarouselLayout, {
  ItemLayout,
} from "../../../components/Layouts/CarouselLayout";

const tele = window.Telegram?.WebApp;

const CitadelItem = ({ icon, itemKey, handleClick, desc, disable }) => {
  return (
    <ItemLayout
      handleClick={() => {
        if (!disable) {
          handleClick();
        }
      }}
      item={{
        icon: icon,
        title: itemKey,
        desc: [desc, ""],
      }}
    />
  );
};

const CitadelCarousel = ({ enableGuide, mythData }) => {
  const { activeMyth, gameData, setSection, enableHaptic, setMinimize } =
    useContext(RorContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const boosters = [
      {
        key: "blacksmith",
        component: (
          <CitadelItem
            icon="h"
            isMulti={false}
            itemKey="furnace"
            desc="Blacksmith"
            handleClick={async () => {
              handleClickHaptic(tele, enableHaptic);
              setMinimize(1);
              setSection(3);
            }}
          />
        ),
      },
      {
        key: "bank",
        component: (
          <CitadelItem
            icon="A"
            itemKey="bank"
            desc="Banker"
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setMinimize(1);
              setSection(4);
            }}
          />
        ),
      },
      {
        key: "library",
        component: (
          <CitadelItem
            disable={false}
            icon="+"
            isMulti={false}
            itemKey="library"
            desc="Librarian"
            handleClick={async () => {
              handleClickHaptic(tele, enableHaptic);
              setMinimize(1);
              setSection(6);
            }}
          />
        ),
      },
      {
        key: "rest",
        component: (
          <CitadelItem
            disable={false}
            icon="7"
            isMulti={false}
            itemKey="tavern"
            desc="Bartender"
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setMinimize(1);
              setSection(7);
            }}
          />
        ),
      },
      {
        key: "gemologist",
        component: (
          <CitadelItem
            disable={false}
            icon="v"
            isMulti={false}
            itemKey="apothecary"
            desc="Gemologist"
            handleClick={async () => {
              handleClickHaptic(tele, enableHaptic);
              setMinimize(1);
              setSection(5);
            }}
          />
        ),
      },
      {
        key: "port",
        component: (
          <CitadelItem
            disable={true}
            icon="E"
            isMulti={false}
            itemKey="port"
            desc="Port"
            handleClick={() => {}}
          />
        ),
      },
    ];

    const boosterStatus = {
      blacksmith: false,
      vault: true,
      library: false,
      rest: false,
      gemologist:
        gameData.stats.blackShards >= 100 || gameData.stats.whiteShards >= 100,
    };

    const predefinedOrder = [
      "bank",
      "blacksmith",
      "library",
      "rest",
      "gemologist",
      "port",
    ];

    const sortedItems = boosters
      .filter((item) => predefinedOrder.includes(item.key))
      .sort((a, b) => {
        const statusA = boosterStatus[a.key] || false;
        const statusB = boosterStatus[b.key] || false;

        if (statusA && !statusB) return -1;
        if (!statusA && statusB) return 1;

        const orderA = predefinedOrder.indexOf(a.key);
        const orderB = predefinedOrder.indexOf(b.key);
        return orderA - orderB;
      })
      .map((item) => item.component);

    setItems(sortedItems);
  }, [activeMyth, enableGuide, mythData, gameData]);

  return <CarouselLayout items={items} />;
};

export default CitadelCarousel;
