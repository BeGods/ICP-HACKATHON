import React, { useContext, useRef } from "react";
import { MainContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";
import { updateMsnStatus } from "../../../utils/api.fof";
import { Lock } from "lucide-react";
import { showToast } from "../../Toast/Toast";

const PayoutInfoCard = ({ close, data }) => {
  const { i18n } = useTranslation();
  let disableClick = useRef(false);
  const { assets, isTelegram, authToken, setUserData, setPayouts } =
    useContext(MainContext);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div className="relative card-width rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.bgInfo}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>

        <div className="absolute top-0 w-full flex flex-col justify-center leading-8 items-center text-center text-card text-paperHead font-bold mt-2 uppercase z-30">
          <div className="w-3/4">{data?.title}</div>
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
          className={`absolute leading-[3dvh] text-paperSub text-card inset-0 w-[85%] mx-auto flex flex-col justify-start pt-[50%] font-[550] z-30 ${
            (i18n.language === "hi" ||
              i18n.language === "th" ||
              i18n.language === "ru") &&
            "font-normal"
          }`}
        >
          <div className="flex flex-col gap-y-4">{data?.description}</div>
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

        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={1} />
      </div>

      {!data.isClaimed && data.limit > 0 && (
        <div
          onClick={handleClaimMsn}
          className="flex cursor-pointer justify-center items-center relative h-fit mt-1"
        >
          <img src={assets.buttons.black.off} alt="button" />
          <div className="absolute z-50 flex items-center justify-center  text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
            <h1 className="uppercase">
              {data.id == "684882aa7c77e14a7262bbcc" ? (
                <Lock strokeWidth={3} />
              ) : (
                "Verify"
              )}{" "}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutInfoCard;
