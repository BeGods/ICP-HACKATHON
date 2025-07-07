import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import NotifCarousel from "../../../components/Carousel/NotifCarousel";
import NotifHeader from "./Header";

const Notification = () => {
  const { assets, isTgMobile, setShowBack } = useContext(MainContext);
  const [category, setCategory] = useState(1);
  const notifs = [];

  useEffect(() => {
    setShowBack(3);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <div
      className={`flex flex-col ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0`}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(${assets.uxui.baseBgA})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <NotifHeader
        category={category}
        setCategory={(idx) => setCategory(idx)}
      />
      <div className="relative flex flex-col justify-center items-center my-auto h-1/2 w-full">
        <NotifCarousel notifs={notifs} />
      </div>
      <>
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
    </div>
  );
};

export default Notification;
