import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../context/context";
import { useTwitterAuth } from "../../hooks/TwitterLogin";
import useWalletPayment from "../../hooks/LineWallet";
import { useLocation } from "react-router-dom";
import { handleClickHaptic, setAuthCookie } from "../../helpers/cookie.helper";
import {
  authenticateLineWallet,
  authenticateTwitter,
  fetchOTP,
  fetchResendOTP,
  verifyOtp,
} from "../../utils/api.fof";
import { toast } from "react-toastify";
import ToastMesg from "../../components/Toast/ToastMesg";
import { useTranslation } from "react-i18next";
import { trackComponentView, trackEvent } from "../../utils/ga";
import { X } from "lucide-react";
import { countries } from "../../utils/country";
import { showToast } from "../Toast/Toast";
import TelegramLogin from "../../hooks/TelegramLogin";

const tele = window.Telegram?.WebApp;

const OnboardOTP = ({ showVerify, updateVerify, refer, setOtpSentOn }) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Thailand",
    code: "THA",
    flag: "🇹🇭",
    dialCode: "+66",
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
    if (showVerify) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 0);
    }
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
      setOtpSentOn(selectedCountry.dialCode + "-" + phone);
      await fetchOTP(selectedCountry.dialCode + "-" + phone, name);
      showToast("form_success");
      updateVerify();

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
    <>
      {showVerify ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex space-x-4 mt-4">
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
            className="w-full py-2.5 text-black font-semibold bg-white rounded-lg hover:bg-gray-300 transition"
          >
            {t("misc.verify")}
          </button>
          {showCount && (
            <div
              className="text-sm cursor-pointer underline text-gray-400 hover:text-gray-200 transition"
              onClick={countDown === 0 ? handleResendOtp : null}
            >
              {countDown > 0 ? `${countDown}s` : t("misc.resendOTP")}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-1 w-full">
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

          <div className="flex border  border-gray-600 rounded-lg bg-gray-800 overflow-hidden">
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
              className="absolute cursor-pointer mt-2 max-h-60 w-fit z-50 bg-white border border-gray-700 text-black rounded-lg shadow-lg overflow-auto"
              ref={dropdownRef}
            >
              {availableCountries.map((country, idx) => (
                <div
                  key={country.code}
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                    idx !== availableCountries.length - 1
                      ? "border-b border-gray-400"
                      : ""
                  } hover:bg-gray-200 transition`}
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
            className="w-full py-2.5 cursor-pointer text-lg font-semibold text-black bg-white rounded-lg hover:bg-gray-300 transition"
          >
            {t("misc.getOTP")}
          </button>

          <p className="text-center cursor-pointer text-sm text-gray-400">
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
        }}
        className="absolute top-0 right-0 cursor-pointer -mt-4 -mr-4 bg-black p-1 rounded-full"
      >
        <X size={"1.75rem"} />
      </div>
    </>
  );
};

export default function LoginModal() {
  const { t } = useTranslation();
  const { setAuthToken, assets } = useContext(MainContext);
  const [otpSentOn, setOtpSentOn] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const { loginWithTwitter } = useTwitterAuth();
  const { connectWallet } = useWalletPayment();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const refer = queryParams.get("refer");
  let isReferLink = refer?.includes("FDG");
  let referrer = isReferLink ? refer : null;

  const handleDappWallet = async () => {
    handleClickHaptic(tele, true);
    try {
      const { accountAddress, signature, message } = await connectWallet();
      if (accountAddress) {
        const response = await authenticateLineWallet(
          message,
          signature,
          referrer
        );
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

  const handleTwitterLogin = async () => {
    try {
      const { token, twitterUsername } = await loginWithTwitter();

      if (!token) {
        console.log("Failed to login twitter.");
      }

      const response = await authenticateTwitter(
        { token: token, twitterUsername: twitterUsername },
        referrer
      );

      setAuthToken(response.data.accessToken);
      await setAuthCookie(tele, response.data.accessToken);
      window.location.reload();
    } catch (error) {
      console.log("Twitter login error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 text-white w-full max-w-sm p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center gap-4">
        {/* Logo & Title */}
        <div className="flex justify-start gap-x-4 items-center w-full">
          <img
            draggable={false}
            src={assets.logos.begodsBlack}
            alt="logo"
            className="w-[50px] pointer-events-none select-none"
          />
          {showVerify ? (
            <div className="relative w-full">
              <h1 className="text-xl font-semibold">{t("misc.enterOTP")}</h1>
              <h2 className="text-sm text-gray-400">
                OTP sent to {otpSentOn.slice(0, 6)}******{otpSentOn.slice(-2)}
              </h2>
              <X
                onClick={() => {
                  setShowVerify(false);
                  handleClickHaptic(tele, true);
                }}
                className="absolute top-0 right-0"
              />
            </div>
          ) : (
            <div>
              <h1 className="font-semibold text-xl">Sign in</h1>

              <h2 className="text-sm text-gray-400">
                Explore the world's largest mythoverse!
              </h2>
            </div>
          )}
        </div>
        {/* Section 1: Social logins */}
        <div
          className={`flex justify-center gap-3 mt-2 w-full ${
            showVerify && "hidden"
          }`}
        >
          <TelegramLogin botUsername={process.env.BOT_USERNAME} />
          {[
            {
              alt: "X",
              src: "https://i.postimg.cc/VsZkyTm2/x-social-media-white-icon.png",
              func: () => {
                handleTwitterLogin();
              },
            },
            {
              alt: "LINE",
              src: "https://i.postimg.cc/6p0b1N66/line-icon.png",
              func: () => {
                handleLineLogin();
              },
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={item.func}
              className="flex justify-center items-center cursor-pointer bg-gray-700 hover:bg-gray-600 transition w-full py-2.5 rounded-lg"
            >
              <img src={item.src} alt={item.alt} className="w-6 h-6" />
            </div>
          ))}
        </div>
        {/* Section 2: Mobile input */}
        <OnboardOTP
          showVerify={showVerify}
          updateVerify={() => setShowVerify((prev) => !prev)}
          refer={referrer}
          setOtpSentOn={(val) => setOtpSentOn(val)}
        />
        {!showVerify && (
          <>
            <div className="text-center text-sm text-gray-500">OR</div>

            {/* Section 3: Wallet connect */}
            <button
              onClick={handleDappWallet}
              className="flex justify-center items-center w-full cursor-pointer bg-[#06C755] text-white h-[48px] rounded-lg font-medium transition text-[16px]"
            >
              <div className="flex items-center gap-x-1">
                <img
                  src="https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/dapp.white.png"
                  alt="dapp"
                  className="w-[22px] h-[22px]"
                />
                <span>Connect</span>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// {
//     alt: "Telegram",
//     src: "https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/telegram02.png",
//     func: () => {
//       handleCustomClick();
//     },
//   },
