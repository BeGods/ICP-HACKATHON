import { Megaphone, ThumbsUp } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { claimStreakBonus, fetchProfilePhoto } from "../../utils/api";
import { setTutKey, validateCountryCode } from "../../helpers/cookie.helper";
import { trackEvent } from "../../utils/ga";
import { showToast } from "../../components/Toast/Toast";
import Confetti from "react-confetti";

const tele = window.Telegram?.WebApp;

const Announcement = (props) => {
  const [disableHand, setDisableHand] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { setSection, userData, setUserData, authToken, setActiveReward } =
    useContext(MyContext);

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
  }, []);

  const getProfilePhoto = async () => {
    try {
      const response = await fetchProfilePhoto(authToken);
      if (response.avatarUrl) {
        setUserData((prev) => ({
          ...prev,
          avatarUrl: response.avatarUrl,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStreakBonus = async () => {
    try {
      const activeCountry = await validateCountryCode(tele);
      const rewardsData = await claimStreakBonus(authToken, activeCountry);
      trackEvent("rewards", "claim_streak_reward", "success");
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      if (rewardsData.reward === "fdg") {
        setSection(0);
      } else {
        setActiveReward(rewardsData.reward);
        setSection(10);
      }
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  return (
    <div className="flex relative flex-col h-screen w-screen justify-center font-fof items-center bg-black">
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex flex-col items-center justify-center  pt-4 w-full z-50 h-1/5">
          <div className="text-gold font-symbols">
            <Megaphone size={"20vw"} />
          </div>
          <h1 className="uppercase text-gold text-[12.2vw] text-center -mt-2 text-black-contour break-words leading-[55px]">
            IS LIVE
          </h1>
        </div>
        <div className="flex justify-center items-center w-full absolute  h-full">
          <div className="flex relative flex-col items-center cursor-pointer mt-5">
            <img
              src="/assets/announcements/480px-announcement_00.jpg"
              alt="announcement"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="flex absolute items-start bottom-[75px] justify-center w-full">
          <ThumbsUp
            onClick={() => {
              setTutKey(tele, "announcement01", 2);

              if (!userData.joiningBonus) {
                setSection(9);
                setTimeout(() => {
                  setIsLoading(false);
                }, 3000);
                (async () => {
                  await getProfilePhoto(token);
                })();
              } else if (userData.joiningBonus && userData.isEligibleToClaim) {
                setSection(8);
                setTimeout(() => {
                  setIsLoading(false);
                }, 3000);
              } else if (userData.isStreakActive) {
                (async () => {
                  await getStreakBonus(token);
                })();
              } else {
                setSection(0);
                setTimeout(() => {
                  setIsLoading(false);
                }, 4000);
              }
            }}
            size={"18vw"}
            color="#FFD660"
            className="mx-auto drop-shadow-xl scale-more"
          />
          {disableHand && (
            <div className="font-symbols scale-point z-10 mx-auto my-auto absolute ml-4 mt-6 text-white text-[60px] text-black-contour">
              b
            </div>
          )}
        </div>
      </div>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </div>
  );
};

export default Announcement;
