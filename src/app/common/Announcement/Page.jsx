import { Megaphone, ThumbsUp } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FofContext } from "../../../context/context";

import { handleClickHaptic, setTutKey } from "../../../helpers/cookie.helper";
import { trackEvent } from "../../../utils/ga";
import { showToast } from "../../../components/Toast/Toast";
import Confetti from "react-confetti";
import BasicLayout from "../../../components/Layouts/BasicLayout";

const tele = window.Telegram?.WebApp;

const Announcement = (props) => {
  const [disableHand, setDisableHand] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { setSection, setShowAnmt, enableHaptic, isTgMobile } =
    useContext(FofContext);
  let disableRef = useRef(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  useEffect(() => {
    playConfetti();
    setTimeout(() => {
      setDisableHand(false);
    }, 2000);

    setTimeout(() => {
      getAnmntReward();
    }, 4000);
  }, []);

  // const getAnmntReward = async () => {
  //   if (disableRef.current === false) {
  //     handleClickHaptic(tele, enableHaptic);
  //     disableRef.current = true;
  //     try {
  //       const response = await claimAnmntReward(authToken);
  //       setTutKey(tele, "announcement05", 1);
  //       setSection(8);
  //     } catch (error) {
  //       showToast("default");
  //     }
  //   }
  // };

  const getAnmntReward = async () => {
    if (disableRef.current === false) {
      handleClickHaptic(tele, enableHaptic);
      disableRef.current = true;
      try {
        // const response = await claimAnmntReward(authToken);
        setTutKey(tele, "announcement08", 1);
        setShowAnmt(true);
        setSection(3);
      } catch (error) {
        showToast("default");
      }
    }
  };

  return (
    <>
      <BasicLayout
        TopChild={<h1 className="bonus-heading-text">IS LIVE</h1>}
        CenterChild={
          <div className="flex relative flex-col items-center cursor-pointer mt-5">
            <img
              src="https://media.publit.io/file/BeGods/announcements/480px-telegram.airdrop.bot.jpg"
              alt="announcement"
              className="w-full h-auto"
            />
          </div>
        }
        BottomChild={<></>}
      />

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </>
  );
};

export default Announcement;
