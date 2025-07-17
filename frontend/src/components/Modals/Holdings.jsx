import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../context/context";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  History,
  Wallet,
  X,
} from "lucide-react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { fetchWithdrawHistory, requestWithdraw } from "../../utils/api.fof";
import { showToast } from "../Toast/Toast";
import ModalLayout, {
  ModalItemLyt,
  ModelListLyt,
} from "../Layouts/ModalLayout";

const tele = window.Telegram?.WebApp;

const HoldingsModal = ({ handleClose }) => {
  const {
    enableHaptic,
    userData,
    setUserData,
    assets,
    isTelegram,
    authToken,
    setShowCard,
  } = useContext(MainContext);
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

  const note = (
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
  );

  return (
    <ModalLayout note={note}>
      <ModalItemLyt
        icon={<Wallet />}
        label={walletLabel}
        handleClick={() => {}}
      />

      <ModalItemLyt
        icon={<History />}
        label={"Withdrawal History"}
        handleClick={(e) => {
          if (userData.kaiaAddress) {
            setIsHistory((prev) => !prev);
          } else {
            showToast("wallet_unlinked");
          }
        }}
        placeholder={isHistory ? <ChevronLeft /> : <ChevronRight />}
      />

      <div className="w-full flex flex-col gap-y-1">
        {!isHistory ? (
          <>
            <ModalItemLyt
              icon={
                <img src={assets.misc.usdt} alt="usdt" className="w-[1.8rem]" />
              }
              label={userData.holdings.usdt ?? 0}
              handleClick={(e) => {
                if ((userData.holdings.usdt ?? 0) > 1) {
                  initateWithdraw("usdt");
                }
              }}
              placeholder={
                (userData.holdings.usdt ?? 2) > 1 ? (
                  <Download />
                ) : (
                  <div className="text-red-500">Min. 1 USDT</div>
                )
              }
            />

            {isTelegram ? (
              <ModalItemLyt
                icon={
                  <img
                    src={assets.misc.tgStar}
                    alt="star"
                    className="w-[1.8rem]"
                  />
                }
                label={userData.holdings.stars ?? 0}
                handleClick={(e) => {
                  if ((userData.holdings.stars ?? 0) > 10) {
                    initateWithdraw("stars");
                  }
                }}
                placeholder={
                  (userData.holdings.stars ?? 0) > 10 ? (
                    <Download />
                  ) : (
                    <div className="text-red-500">Min. 10 STARS</div>
                  )
                }
              />
            ) : (
              <ModalItemLyt
                icon={
                  <img
                    src={assets.misc.kaia}
                    alt="kaia"
                    className="w-[1.8rem]"
                  />
                }
                label={userData.holdings.kaia ?? 0}
                handleClick={(e) => {
                  if ((userData.holdings.kaia ?? 0) > 10) {
                    initateWithdraw("kaia");
                  }
                }}
                placeholder={
                  (userData.holdings.kaia ?? 0) > 10 ? (
                    <Download />
                  ) : (
                    <div className="text-red-500">Min. 10 KAIA</div>
                  )
                }
              />
            )}
          </>
        ) : (
          <div className="w-full pt-4">
            {history.length == 0 ? (
              <div className="flex justify-center text-tertiary  text-white text-center w-full mt-1 pl-4"></div>
            ) : (
              history?.map((itm, idx) => (
                <ModelListLyt key={idx} assets={assets} itm={itm} />
              ))
            )}
          </div>
        )}
      </div>
    </ModalLayout>
  );
};

export default HoldingsModal;
