import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/context";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  History,
  Loader,
  Wallet,
  X,
} from "lucide-react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { fetchWithdrawHistory, requestWithdraw } from "../../utils/api.fof";
import { showToast } from "../Toast/Toast";

const tele = window.Telegram?.WebApp;

const HoldingsModal = ({ handleClose }) => {
  const { enableHaptic, userData, setUserData, assets, isTelegram, authToken } =
    useContext(MainContext);
  const [history, setHistory] = useState([]);
  const [isHistory, setIsHistory] = useState(false);

  const getHistory = async () => {
    try {
      const response = await fetchWithdrawHistory(authToken);

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const initateWithdraw = async (type) => {
    if (type !== "stars" && !userData.kaiaAddress) {
      showToast("wallet_unlinked");
    }
    try {
      handleClickHaptic(tele, enableHaptic);

      await requestWithdraw(authToken, type);

      setUserData((prev) => {
        const prevHoldings = prev.holdings || {};

        return {
          ...prev,
          holdings: {
            ...prevHoldings,
            [type]: 0,
          },
        };
      });
      (async () => await getHistory())();

      setIsHistory(true);
      // toast
    } catch (error) {
      // toast
      handleClose();
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => await getHistory())();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div
        className={`flex relative modal-width w-fit -mt-[2.5rem] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col card-shadow-white p-4`}
      >
        <div
          onClick={handleClose}
          className={`absolute cursor-pointer flex w-full justify-end top-0 right-0 -mt-4 -mr-4 `}
        >
          <div className="absolute flex justify-center items-center  bg-black rounded-full w-[40px] h-[40px]">
            <div className="text-white font-roboto text-black-contour text-[1.25rem]">
              {"\u2715"}
            </div>
          </div>
        </div>

        <div className="flex text-tertiary text-white text-left w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            <Wallet />
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">
              {userData.kaiaAddress
                ? `${userData.kaiaAddress?.slice(
                    0,
                    14
                  )}......${userData.kaiaAddress?.slice(-4)}`
                : "Wallet Unlinked"}
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            if (userData.kaiaAddress) {
              setIsHistory((prev) => !prev);
            } else {
              showToast("wallet_unlinked");
            }
          }}
          className="flex text-tertiary text-white text-left w-full mt-6 pl-4"
        >
          <div className="flex justify-start -ml-3">
            <History />
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">Withdrawal History</div>
            {isHistory ? <ChevronLeft /> : <ChevronRight />}
          </div>
        </div>

        {!isHistory ? (
          <>
            <div
              onClick={() => {
                if ((userData.holdings.usdt ?? 2) > 1) {
                  initateWithdraw("usdt");
                }
              }}
              className="flex items-center text-tertiary text-white text-left w-full mt-6 pl-4"
            >
              <div className="flex justify-start relative -ml-3">
                <img src={assets.misc.usdt} alt="usdt" className="w-[1.8rem]" />
              </div>
              <div className="flex justify-between w-full">
                <div className="pl-2">{userData.holdings.usdt ?? 0}</div>
                {(userData.holdings.usdt ?? 2) > 1 ? (
                  <Download />
                ) : (
                  <div className="text-red-500">Min. 1 USDT</div>
                )}
              </div>
            </div>

            {isTelegram ? (
              <div
                onClick={() => {
                  if ((userData.holdings.stars ?? 0) > 10) {
                    initateWithdraw("stars");
                  }
                }}
                className="flex items-center text-tertiary text-white text-left w-full mt-6 pl-4"
              >
                <div className="flex justify-start relative -ml-3">
                  <img
                    src={assets.misc.tgStar}
                    alt="star"
                    className="w-[1.8rem]"
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="pl-2">{userData.holdings.stars ?? 0}</div>
                  {(userData.holdings.stars ?? 0) > 10 ? (
                    <Download />
                  ) : (
                    <div className="text-red-500">Min. 10 STARS</div>
                  )}
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  if ((userData.holdings.kaia ?? 0) > 10) {
                    initateWithdraw("kaia");
                  }
                }}
                className="flex items-center text-tertiary text-white text-left w-full mt-6 pl-4"
              >
                <div className="flex justify-start relative -ml-3">
                  <img
                    src={assets.misc.kaia}
                    alt="kaia"
                    className="w-[1.8rem]"
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="pl-2">{userData.holdings.kaia ?? 0}</div>
                  <div>
                    {(userData.holdings.kaia ?? 0) > 10 ? (
                      <Download />
                    ) : (
                      <div className="text-red-500">Min. 10 KAIA</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full pt-4">
            {history.length == 0 ? (
              <div className="flex justify-center text-tertiary  text-white text-center w-full mt-1 pl-4"></div>
            ) : (
              history?.map((itm, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-black/30 rounded-xl px-2 py-1 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={
                        itm.currency == "STAR"
                          ? assets.misc.tgStar
                          : itm.currency == "KAIA"
                          ? assets.misc.kaia
                          : assets.misc.usdt
                      }
                      alt="currency"
                      className="w-[1.8rem]"
                    />
                    <div>
                      <div className="text-white font-medium">
                        {itm.amount + " " + itm.currency}
                      </div>
                      <div className="text-sm text-gray-400">
                        {itm.updatedAt.split("T")[0]}
                      </div>
                    </div>
                  </div>

                  {itm.status === "success" ? (
                    <span className="text-sm px-1 py-1 rounded-full bg-green-600/20 text-green-400">
                      <Check />
                    </span>
                  ) : itm.status === "failed" ? (
                    <span className="text-sm px-1 py-1 rounded-full bg-red-600/20 text-red-400">
                      <X />
                    </span>
                  ) : (
                    <span className="text-sm px-1 py-1 rounded-full bg-yellow-600/20 text-yellow-400">
                      <Loader />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col text-tertiary  text-white text-left modal-width mt-6 pl-2">
        <span>
          Note: You can withdraw only if you have at least{" "}
          {isTelegram ? "10 STARS" : "10 KAIA"} or 1 USDT. Withdrawals are
          processed and credited within 48 hours.
        </span>
        <div className="flex flex-col mt-4">
          {!isHistory &&
            ((userData.holdings.kaia ?? 0) > 10 ||
              (userData.holdings.usdt ?? 2) > 1 ||
              (userData.holdings.kaia ?? 0) > 10) && (
              <div className="flex w-full justify-center uppercase text-gold gap-x-2">
                <span>Click</span>
                <Download color="gold" />
                <span>Withdraw</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HoldingsModal;
