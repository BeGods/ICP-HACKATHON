import React, { useState, useEffect, useRef, useContext } from "react";
import { countries } from "../../../utils/country";
import {
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
import { ArrowLeft } from "lucide-react";
import ToastMesg from "../../../components/Toast/ToastMesg";
import { toast } from "react-toastify";

const tele = window.Telegram?.WebApp;

const OnboardPage = ({ handleTokenUpdated, refer }) => {
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
  const { authToken, isTelegram, setAuthToken } = useContext(MainContext);
  const [otp, setOTP] = useState(new Array(4).fill(""));
  const dropdownRef = useRef(null);
  const firstInputRef = useRef(null);
  const availableCountries = countries.filter(
    (country) => country.code == "IND" || country.code == "THA"
  );

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
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
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
    <div
      className={`relative flex flex-col justify-center ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } w-screen font-roboto bg-black`}
    >
      {showVerify && (
        <div
          onClick={() => {
            setShowVerify(false);
          }}
          className="absolute p-1 top-0 ml-3"
        >
          <ArrowLeft color="white" size={"7vw"} />
        </div>
      )}

      <div className="w-full h-fit -mt-[18vh]">
        <img
          src="https://media.publit.io/file/BattleofGods/FoF/Assets/LOGOS/battle.gods.white.svg"
          alt="fof"
          className="w-1/4 opacity-95 mx-auto scale-loader-glow"
        />

        {showVerify ? (
          <div className="flex flex-col items-center mx-auto w-[85%] text-white mt-14 gap-y-4">
            <div className="flex justify-between w-full">
              <div className="text-lg font-medium w-full">
                {t("misc.enterOTP")}
              </div>
              <div className="w-full">
                {showCount && (
                  <div
                    onClick={() => {
                      if (countDown === 0) {
                        handleResendOtp();
                      }
                    }}
                    className="flex text-md cursor-pointer justify-end w-full font-medium"
                  >
                    {countDown > 0 ? (
                      <div className="pl-2">{countDown}s</div>
                    ) : (
                      <div
                        onClick={handleResendOtp}
                        className="cursor-pointer underline"
                      >
                        {t("misc.resendOTP")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-start -mt-1">
              {otp.map((digit, index) => (
                <input
                  ref={index === 0 ? firstInputRef : null}
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 bg-gray-800 outline-white/20 h-12 text-4xl border border-gray-600 rounded mx-1 text-center"
                  value={digit}
                  onChange={(event) => handleChange(index, event)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                />
              ))}
            </div>
            <div
              onClick={handleVerifyOtp}
              className="bg-white w-full flex justify-center items-center text-black text-[4vw] font-medium py-3 rounded-md"
            >
              {t("misc.verify")}
            </div>
          </div>
        ) : (
          <div className="flex flex-col mx-auto w-[85%] text-white gap-y-3 mt-14">
            {createAcnt && (
              <div className="w-full h-[6.5vh] border-gray-400 border-2 rounded-lg">
                <input
                  type="text"
                  className="w-full text-[4vw] px-4 h-full bg-inherit outline-none"
                  placeholder={`Username`}
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                    setName(value);
                  }}
                />
              </div>
            )}

            <div className="flex border-gray-400 border-2 rounded-lg h-[6.5vh] gap-2 text-[4vw]">
              <div
                className="flex justify-center items-center gap-1 w-[25%] cursor-pointer relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickHaptic(tele, true);
                  setIsDropdownOpen((prev) => !prev);
                }}
              >
                <h1>{selectedCountry.dialCode}</h1>
                <h1 className="text-[3vw]">▼</h1>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full text-[4vw] px-2 h-full bg-inherit outline-none"
                  placeholder={t("misc.phone")}
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setPhone(value);
                  }}
                />
              </div>
            </div>
            {isDropdownOpen && (
              <div
                className="absolute mt-[15vh] max-h-[20vh] w-fit overflow-auto bg-white text-black rounded-md shadow-2xl z-10"
                ref={dropdownRef}
              >
                {availableCountries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
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
            <div
              onClick={handleGenerateOtp}
              className="bg-white active:bg-gray-200 flex justify-center items-center text-black text-[4vw] font-medium py-3 mt-2 rounded-md"
            >
              {t("misc.getOTP")}
            </div>
            {!createAcnt ? (
              <div className="mx-auto text-[3.5vw] text-gray-500 mt-3">
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setCreateAcnt(true);
                  }}
                  className="font-medium text-white ml-1"
                >
                  Create
                </span>
              </div>
            ) : (
              <div className="mx-auto text-[3.5vw] text-gray-500 mt-3">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCreateAcnt(false);
                  }}
                  className="font-medium text-white ml-1"
                >
                  Login
                </span>
              </div>
            )}
          </div>
        )}
        <div className="w-full flex justify-center text-[3vw] absolute bottom-[2vh] text-gray-600">
          <span className="pr-1 underline cursor-pointer">
            {t("misc.policy")}
          </span>{" "}
          | @Frogdog Games 2025
        </div>
      </div>
    </div>
  );
};

export default OnboardPage;
