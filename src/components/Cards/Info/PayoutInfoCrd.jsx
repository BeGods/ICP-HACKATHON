import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import { updateMsnStatus } from "../../../utils/api.fof";
import { ThumbsUp } from "lucide-react";
import { showToast } from "../../Toast/Toast";
import { mythSymbols } from "../../../utils/constants.fof";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { PrimaryBtn } from "../../Buttons/PrimaryBtn";

const PayoutInfoCard = ({ close, data }) => {
  const { i18n } = useTranslation();
  let disableClick = useRef(false);
  const { assets, isTelegram, authToken, setUserData, setPayouts } =
    useContext(MainContext);
  const myths = ["greek", "celtic", "norse", "egyptian"];
  const [activeColor, setActiveColor] = useState(0);
  const activeColorRef = useRef(activeColor);

  const handleClaimMsn = async () => {
    if (disableClick.current) return;

    disableClick.current = true;

    try {
      const paymentType = data.paymentType?.includes("USDT")
        ? "usdt"
        : isTelegram
        ? "stars"
        : "kaia";

      await updateMsnStatus(authToken, data.id, paymentType);

      setUserData((prev) => {
        const prevHoldings = prev.holdings || {};
        const updatedAmount = (prevHoldings[paymentType] || 0) + data.amount;

        return {
          ...prev,
          holdings: {
            ...prevHoldings,
            [paymentType]: updatedAmount,
          },
        };
      });

      setPayouts((prev) =>
        prev.map((payout) =>
          payout.id === data.id ? { ...payout, isClaimed: true } : payout
        )
      );

      showToast("payout_success");
    } catch (err) {
      console.error(err);
      showToast("payout_error");
    } finally {
      setTimeout(() => {
        disableClick.current = false;
      }, 2000);
      close();
    }
  };

  activeColorRef.current = activeColor;

  useEffect(() => {
    if (data.id == "685d8eb394c823384381ede1") {
      const interval = setInterval(() => {
        setActiveColor((prev) => (prev + 1) % myths.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [myths.length]);

  return (
    <OverlayLayout>
      <div className="center-section">
        <div className="relative card-width rounded-lg shadow-lg card-shadow-white">
          <div className="relative w-full h-full text-card">
            <img
              src={assets.uxui.bgInfo}
              alt="info card background"
              className="w-full h-full object-cover rounded-primary z-10"
            />
          </div>

          <div className="absolute top-0 w-full flex flex-col justify-center leading-8 items-center text-center text-card font-bold mt-2 uppercase z-30">
            <div className="w-3/4 text-paperHead">{data?.title}</div>
            <h2 className={`-mt-1 text-paperSub font-medium uppercase`}>
              {data?.amount}{" "}
              <span>
                {" "}
                {data.paymentType?.includes("USDT")
                  ? "USDT"
                  : isTelegram
                  ? "STAR"
                  : "KAIA"}
              </span>
            </h2>
          </div>

          <div
            className={`absolute leading-[3dvh]  text-card inset-0 w-[85%] mx-auto flex flex-col justify-center font-[550] z-30 ${
              (i18n.language === "hi" ||
                i18n.language === "th" ||
                i18n.language === "ru") &&
              "font-normal"
            }`}
          >
            <div className="flex flex-col text-para gap-y-4">
              {data?.description}
            </div>
            {data.id == "685d8eb394c823384381ede1" && (
              <div className="flex flex-col justify-center items-start gap-y-3 my-3">
                <div className="flex justify-start items-center gap-x-3">
                  <div
                    className={`flex relative text-center justify-center items-end max-w-xs-orb  rounded-full glow-icon-black`}
                  >
                    <img src={assets.uxui.baseOrb} alt={`gray orb`} />
                    <span
                      className={`absolute z-1 text-[1.5rem] ml-0.5 opacity-50 orb-symbol-shadow mb-1  font-symbols text-white `}
                    >
                      g
                    </span>
                  </div>
                  <h1 className="text-primary font-semibold">=</h1>
                  <div className="text-[28px] -ml-2.5">1000</div>
                  <div className="text-[24px] font-roboto font-medium">
                    X
                  </div>{" "}
                  <div
                    className={`flex relative text-center justify-center items-center max-w-xs-orb rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt={`gray orb`}
                      className={`filter-orbs-${myths[activeColor]} transition-all duration-1000`}
                    />
                    <span
                      className={`absolute z-1  justify-center items-center font-symbols text-white `}
                    >
                      <div className="text-symbol-xs transition-all duration-1000  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white">
                        {mythSymbols[myths[activeColor]]}
                      </div>
                    </span>
                  </div>
                </div>
                <div className="flex justify-start items-center gap-x-3">
                  <div
                    className={`flex relative text-center justify-center items-center max-w-xs-multi-orb -mt-1 rounded-full glow-icon-black`}
                  >
                    <img src={assets.items.multiorb} alt="multi orb" />
                  </div>
                  <h1 className="text-primary font-semibold">=</h1>
                  <div className="text-[28px] -ml-2.5">2</div>
                  <div className="text-[24px] font-roboto font-medium">
                    X
                  </div>{" "}
                  <div
                    className={`flex relative text-center justify-center items-center max-w-xs-orb rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt={`gray orb`}
                      className={`filter-orbs-${myths[activeColor]} transition-all duration-1000`}
                    />
                    <span
                      className={`absolute z-1  justify-center items-center font-symbols text-white `}
                    >
                      <div className="text-symbol-xs transition-all duration-1000  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white">
                        {mythSymbols[myths[activeColor]]}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {data?.limit > 0 ? (
            <div className="absolute w-full uppercase flex justify-center items-center bottom-0 gap-2 text-para mx-auto px-2 py-1 text-card">
              {data.isClaimed ? (
                "CLAIMED"
              ) : (
                <>
                  {data.limit} <span>Slots Left</span>
                </>
              )}
            </div>
          ) : (
            <div className="absolute w-full text-center uppercase flex justify-center items-center bottom-0 gap-2 text-para mx-auto px-2 py-1 text-red-500 text-black-contour">
              {data?.limit + "  "} Slots Exhausted
            </div>
          )}
        </div>
      </div>

      <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
        {!data.isClaimed && data.limit > 0 && (
          <PrimaryBtn
            mode="default"
            onClick={handleClaimMsn}
            centerContent={<ThumbsUp size={"1.75rem"} color={"white"} />}
            customMyth={8}
          />
        )}
      </div>
    </OverlayLayout>
  );
};

export default PayoutInfoCard;
