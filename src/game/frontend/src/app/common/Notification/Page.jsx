import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import NotifHeader from "./Header";
import BgLayout from "../../../components/Layouts/BgLayout";
import CarouselLayout from "../../../components/Layouts/CarouselLayout";

const Notification = () => {
  const { setShowBack, setSection, game } = useContext(MainContext);
  const [category, setCategory] = useState(1);
  const notifs = [];
  const [items, setItems] = useState([]);
  const profileIdx = game == "fof" ? 3 : 8;

  useEffect(() => {
    const itemsDataMapped = notifs.map((item, idx) => (
      <NotifItem key={item.id} item={item} />
    ));

    setItems(itemsDataMapped);
  }, [notifs]);

  useEffect(() => {
    setShowBack(3);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <BgLayout>
      {/* Header */}
      <NotifHeader
        category={category}
        setCategory={(idx) => setCategory(idx)}
      />
      <CarouselLayout items={items} />
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

export default Notification;
