import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../context/context";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
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
  let disableClick = useRef(false);
  const [history, setHistory] = useState([]);
  const [isHistory, setIsHistory] = useState(false);
  const walletLabel =
    isTelegram && userData.tonAddress
      ? `${userData.tonAddress.slice(0, 9)}...${userData.tonAddress.slice(-6)}`
      : !isTelegram && userData.kaiaAddress
      ? `${userData.kaiaAddress?.slice(0, 9)}...${userData.kaiaAddress.slice(
          -6
        )}`
      : "Wallet Unlinked";

  const getHistory = async () => {
    try {
      const response = await fetchWithdrawHistory(authToken);

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const initateWithdraw = async (type) => {
    if (disableClick.current === true) {
      return;
    }

    disableClick.current = true;

    if (!userData.kaiaAddress) {
      showToast("wallet_unlinked");
      disableClick.current = false;
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
      console.log(error);
    } finally {
      setTimeout(() => {
        disableClick.current = false;
      }, 2000);
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
            <div className="pl-3">{walletLabel}</div>
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

        <div className="w-full flex flex-col gap-y-2">
          {!isHistory ? (
            <>
              <div
                onClick={() => {
                  if ((userData.holdings.usdt ?? 0) > 1) {
                    initateWithdraw("usdt");
                  }
                }}
                className="flex items-center text-tertiary text-white text-left w-full mt-6 pl-4"
              >
                <div className="flex justify-start relative -ml-3">
                  <img
                    src={assets.misc.usdt}
                    alt="usdt"
                    className="w-[1.8rem]"
                  />
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
                    className="flex flex-col gap-1 bg-black/30 rounded-xl px-3 py-2 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            itm.currency === "STAR"
                              ? assets.misc.tgStar
                              : itm.currency === "KAIA"
                              ? assets.misc.kaia
                              : assets.misc.usdt
                          }
                          alt="currency"
                          className="w-7 h-7"
                        />
                        <div>
                          <div className="text-white font-semibold">
                            {itm.amount} {itm.currency}
                          </div>
                          <div className="text-sm text-gray-400">
                            {itm.walletAddress.slice(0, 12)}...
                            {itm.walletAddress.slice(-6)}
                          </div>
                        </div>
                      </div>

                      {itm.status === "success" ? (
                        <span className="flex items-center gap-1 text-sm px-2 py-2 rounded-full bg-green-600/20 text-green-400">
                          <ExternalLink
                            onClick={() => {
                              window.open(
                                `https://kaiascan.io/tx/${itm.paymentId}`,
                                "_blank"
                              );
                            }}
                            className="w-4 h-4"
                          />
                        </span>
                      ) : itm.status === "failed" ? (
                        <span className="flex items-center gap-1 text-sm px-2 py-2 rounded-full bg-red-600/20 text-red-400">
                          <X className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm px-2 py-2 rounded-full bg-yellow-600/20 text-yellow-400">
                          <Loader className="w-4 h-4 animate-spin" />
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
