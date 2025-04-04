import React, { useState, useEffect, useRef, useContext } from "react";
import { countries } from "../../../utils/country";
import {
  authenticateLineWallet,
  fetchOTP,
  fetchResendOTP,
  fetchRewards,
  verifyOtp,
} from "../../../utils/api.fof";
import { MainContext } from "../../../context/context";
import { showToast } from "../../../components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { trackComponentView, trackEvent } from "../../../utils/ga";
import {
  handleClickHaptic,
  setAuthCookie,
} from "../../../helpers/cookie.helper";
import { X } from "lucide-react";
import ToastMesg from "../../../components/Toast/ToastMesg";
import { toast } from "react-toastify";
import TgHeader from "../../../components/Common/TgHeader";
import FoFIntro from "../../common/Intro/FoFIntro";
import RoRIntro from "../../common/Intro/RoRIntro";
import assets from "../../../assets/assets.json";
import { useLocation } from "react-router-dom";
import SettingModal from "../../../components/Modals/Settings";
import useWalletPayment from "../../../hooks/LineWallet";

const tele = window.Telegram?.WebApp;

const OnboardOTP = ({ handleTokenUpdated, refer, closeModal }) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();
  const [showVerify, setShowVerify] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "India",
    code: "IND",
    flag: "🇮🇳",
    dialCode: "+91",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [createAcnt, setCreateAcnt] = useState(false);
  const { authToken, setAuthToken } = useContext(MainContext);
  const [otp, setOTP] = useState(new Array(4).fill(""));
  const dropdownRef = useRef(null);
  const firstInputRef = useRef(null);
  const availableCountries = countries.filter(
    (country) => country.code == "IND" || country.code == "THA"
  );
  const otpRefs = useRef([]);

  useEffect(() => {
    if (showVerify) firstInputRef.current.focus();
  }, [showVerify]);

  const handleChange = (index, event) => {
    const { value } = event.target;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleGenerateOtp = async () => {
    try {
      handleClickHaptic(tele, true);

      if (createAcnt) {
        if (phone.length !== 10 || !name.trim()) {
          showToast("form_error");
          return;
        }
      } else {
        if (phone.length !== 10) {
          showToast("form_error");
          return;
        }
      }

      await fetchOTP(selectedCountry.dialCode + "-" + phone, name);
      showToast("form_success");
      setShowVerify(true);

      setCountDown(15); // Start countdown from 15
      let interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response && error.response.status === 400
          ? error.response.data.message || "Invalid request. Please try again."
          : "Failed to generate OTP. Please check your network and try again.";

      toast.error(
        <ToastMesg
          title={t("toasts.InputValidate.error.title")}
          desc={errorMessage}
          status="fail"
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleResendOtp = async () => {
    handleClickHaptic(tele, true);
    if (createAcnt) {
      if (phone.length !== 10 || !name.trim()) {
        showToast("form_error");
        return;
      }
    } else {
      if (phone.length !== 10) {
        showToast("form_error");
        return;
      }
    }

    try {
      await fetchResendOTP(selectedCountry.dialCode + "-" + phone, authToken);
      showToast("form_success");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response && error.response.status === 400
          ? error.response.data.message || "Invalid request. Please try again."
          : "Failed to generate OTP. Please check your network and try again.";

      toast.error(
        <ToastMesg
          title={t("toasts.InputValidate.error.title")}
          desc={errorMessage}
          status="fail"
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleVerifyOtp = async () => {
    handleClickHaptic(tele, true);
    if (createAcnt) {
      if (phone.length !== 10 || !name.trim()) {
        showToast("form_error");
        return;
      }
    } else {
      if (phone.length !== 10) {
        showToast("form_error");
        return;
      }
    }

    try {
      const response = await verifyOtp(
        selectedCountry.dialCode + "-" + phone,
        name,
        otp.join(""),
        refer
      );

      trackEvent("misc", "mobile_verified", "success");
      showToast("onboard_success");
      setAuthToken(response.data.accessToken);
      await setAuthCookie(tele, response.data.accessToken);
      window.location.reload();
      setCountDown(15);
      setShowCount(true);
      handleTokenUpdated();
      let interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowCount(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      showToast("onboard_error");
    }
  };

  useEffect(() => {
    trackComponentView("onboard_form");
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (countDown > 0) {
      setShowCount(true);
    }
  }, [countDown]);

  useEffect(() => {
    setName("");
    setPhone("");
  }, [createAcnt]);

  return (
    <div className="absolute z-50 flex flex-col w-[85%] max-w-md p-6 bg-gray-950 text-white rounded-2xl shadow-2xl">
      {showVerify ? (
        <div className="flex flex-col items-center gap-5">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-lg font-semibold">{t("misc.enterOTP")}</h2>
            {showCount && (
              <div
                className="text-sm cursor-pointer text-gray-400 hover:text-gray-200 transition"
                onClick={countDown === 0 ? handleResendOtp : null}
              >
                {countDown > 0 ? `${countDown}s` : t("misc.resendOTP")}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {otp.map((digit, index) => (
              <input
                ref={(el) => (otpRefs.current[index] = el)}
                key={index}
                type="number"
                maxLength={1}
                className="w-12 h-12 text-2xl text-center bg-gray-800 border border-gray-600 rounded-lg outline-none focus:border-white transition"
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            className="w-full py-3 text-black font-semibold bg-white rounded-lg hover:bg-gray-300 transition"
          >
            {t("misc.verify")}
          </button>
          <p
            onClick={() => {
              setShowVerify(false);
              handleClickHaptic(tele, true);
            }}
            className="text-center text-sm text-gray-400 underline"
          >
            Go back
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {createAcnt && (
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 text-lg bg-gray-800 border border-gray-600 rounded-lg outline-none focus:border-white transition"
                placeholder="Username"
                value={name}
                onChange={(e) =>
                  setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
              />
            </div>
          )}

          <div className="flex border border-gray-600 rounded-lg bg-gray-800 overflow-hidden">
            <button
              className="flex items-center justify-center w-[30%] px-3 bg-gray-700 hover:bg-gray-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((prev) => !prev);
              }}
            >
              {selectedCountry.dialCode} ▼
            </button>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-3 text-lg bg-gray-800 outline-none"
              placeholder={t("misc.phone")}
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setPhone(value);
              }}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="absolute mt-2 max-h-60 w-full bg-white text-black rounded-lg shadow-lg overflow-auto"
              ref={dropdownRef}
            >
              {availableCountries.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span>{country.flag}</span>
                  <span className="font-medium">{country.dialCode}</span>
                  <span>
                    {country.name.length > 20
                      ? `${country.name.slice(0, 20)}...`
                      : country.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleGenerateOtp}
            className="w-full py-3 text-lg font-semibold text-black bg-white rounded-lg hover:bg-gray-300 transition"
          >
            {t("misc.getOTP")}
          </button>

          <p className="text-center text-sm text-gray-400">
            {createAcnt ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => {
                handleClickHaptic(tele, true);
                setCreateAcnt(!createAcnt);
              }}
              className="ml-1 font-medium text-white cursor-pointer hover:underline"
            >
              {createAcnt ? "Login" : "Create"}
            </span>
          </p>
        </div>
      )}
      <div
        onClick={() => {
          handleClickHaptic(tele, true);
          closeModal();
        }}
        className="absolute top-0 right-0 -mt-4 -mr-4 bg-black p-1 rounded-full"
      >
        <X size={"1.75rem"} />
      </div>
    </div>
  );
};

const AuthMenu = ({ showMobileAuth, closeModal, openModal }) => {
  const { setLineWallet, setAuthToken } = useContext(MainContext);
  const { connectWallet } = useWalletPayment();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const refer = queryParams.get("refer");

  const handleConnectLineWallet = async () => {
    handleClickHaptic(tele, true);
    try {
      const { accountAddress, signature, message } = await connectWallet();
      if (accountAddress) {
        const response = await authenticateLineWallet(message, signature);
        setAuthToken(response.data.accessToken);
        await setAuthCookie(tele, response.data.accessToken);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  const handleLineLogin = async () => {
    handleClickHaptic(tele, true);
    try {
      const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
        import.meta.env.VITE_LINE_CHANNEL
      }&redirect_uri=${encodeURIComponent(
        `${import.meta.env.VITE_CLIENT}/auth/line/callback`
      )}&state=xyz123abc&scope=profile%20openid%20email&nonce=secureRandomNonce`;

      window.location.href = lineAuthUrl;
    } catch (error) {
      console.log("LINE login error:", error);
    }
  };

  return (
    <div
      className="absolute ml-[150vw] top-0 bottom-0 left-0 w-screen h-full z-[99]"
      style={{
        background: `url(${assets.uxui.dodsplash}) no-repeat center / cover`,
        backgroundPosition: "45.75% 0%",
      }}
    >
      <div className={`flex  flex-col h-full items-center justify-center`}>
        {showMobileAuth && <OnboardOTP closeModal={() => closeModal()} />}

        <div className="absolute flex flex-col justify-between items-center h-full py-[3.5dvh]">
          <img
            src={assets.logos.begodsBlack}
            alt="logo"
            className="w-[85px] begod-text-shadow pointer-events-none"
          />
          {!showMobileAuth && (
            <div className="flex flex-col z-[99] gap-[1.5dvh] mb-[8dvh]">
              {/* <img
                src={assets.buttons.otp}
                alt="otp-button"
                className="begod-text-shadow w-[215px]"
                onClick={() => {
                  handleClickHaptic(tele, true);
                  openModal();
                }}
              />
            */}
              <img
                src={assets.buttons.line}
                alt="line-button"
                className="begod-text-shadow w-[215px]"
                onClick={handleLineLogin}
              />
              <div
                onClick={handleConnectLineWallet}
                className="flex cursor-pointer justify-center items-center rounded-[12px] w-[240px] bg-[#06C755] text-[#FFFFFF] h-[60px] px-[28px] gap-[10px]"
              >
                <img
                  src="/assets/dapp.logo.png"
                  alt="dapp"
                  className="w-[28px] min-w-[26px] max-w-[34px]"
                />
                <h1 className="text-[18px] min-text-[18px] max-text-[24px] font-medium font-[SF Pro Display, SF Pro Text, Apple SD Gothic Neo]">
                  Connect
                </h1>
              </div>

              {/* <img
                src={assets.buttons.dapp}
                alt="dapp-button"
                className="begod-text-shadow w-[215px]"
                onClick={handleConnectLineWallet}
              /> */}
              {/* {refer == "dapp" ? (
                <img
                  src={assets.buttons.dapp}
                  alt="dapp-button"
                  className="begod-text-shadow w-[215px]"
                  onClick={handleConnectLineWallet}
                />
              ) : (
                <img
                  src={assets.buttons.telegram}
                  alt="dapp-button"
                  className="begod-text-shadow w-[215px]"
                  onClick={() => {
                    alert("Coming Soon");
                  }}
                />
              )} */}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center text-[0.75rem] absolute bottom-[1.5dvh] mx-auto text-gray-600">
        {/* <span className="pr-1 underline cursor-pointer">
          {t("misc.policy")} |
        </span>{" "} */}
        © 2025 Frogdog Games
      </div>
    </div>
  );
};

const OnboardPage = () => {
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  return (
    <div className="flex w-screen text-wrap">
      <TgHeader
        hideExit={true}
        openSettings={() => {
          setShowMobileAuth(false);
          setShowSetting(true);
        }}
      />
      <div className={`transition-all duration-500 overflow-hidden relative`}>
        <div
          className="slider-container flex transition-transform duration-500"
          style={{
            width: "400vw",
            transform: `translateX(-150vw)`,
          }}
        >
          <FoFIntro />
          <RoRIntro />
          <AuthMenu
            showMobileAuth={showMobileAuth}
            closeModal={() => setShowMobileAuth(false)}
            openModal={() => setShowMobileAuth(true)}
          />
        </div>
      </div>

      {showSetting && (
        <div className="absolute z-[99] w-screen">
          <SettingModal close={() => setShowSetting(false)} />
        </div>
      )}
    </div>
  );
};
export default OnboardPage;
