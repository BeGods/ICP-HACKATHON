import React, { useState, useEffect, useRef, useContext } from "react";
import { countries } from "../../utils/country";
import {
  fetchOTP,
  fetchResendOTP,
  fetchRewards,
  verifyOtp,
} from "../../utils/api";
import { MyContext } from "../../context/context";
import { showToast } from "../../components/Toast/Toast";
import { useTranslation } from "react-i18next";

const OnboardPage = (props) => {
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
  const [countDown, setCountDown] = useState(15);
  const {
    authToken,
    setUserData,
    setSection,
    setRewards,
    setRewardsClaimedInLastHr,
  } = useContext(MyContext);
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const dropdownRef = useRef(null);
  const firstInputRef = useRef(null);
  const availableCountries = countries.filter(
    (country) => country.code !== "NA"
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

  const getPartnersData = async (lang, country) => {
    try {
      const rewardsData = await fetchRewards(lang, country, authToken);
      setRewards([...rewardsData?.rewards, ...rewardsData?.claimedRewards]);
      setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
      localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateOtp = async () => {
    if (phone.length !== 10 || name.length === 0 || name === "" || !name) {
      showToast("form_error");
      return;
    }

    try {
      await fetchOTP(selectedCountry.dialCode + phone, authToken);
      showToast("form_success");
      setShowVerify(true);
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
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    if (phone.length !== 10) {
      showToast("form_error");
      return;
    }

    try {
      await fetchResendOTP(selectedCountry.dialCode + phone, authToken);
      showToast("form_success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (phone.length != 10 || name.length == 0 || name === "" || !name) {
      showToast("phone_valid_error");
      return;
    }

    try {
      await verifyOtp(
        selectedCountry.dialCode + phone,
        name,
        otp.join(""),
        authToken
      );
      setSection(0);
      showToast("onboard_success");
      setUserData((prevState) => ({
        ...prevState,
        isPlaySuperVerified: true,
      }));
      (async () => await getPartnersData())();
    } catch (error) {
      console.log(error);
      showToast("onboard_error");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen font-roboto bg-black">
      <img
        src="https://media.publit.io/file/BattleofGods/FoF/Assets/LOGOS/frogdog.games.black.svg"
        alt="fof"
        className="w-full opacity-55 pt-4"
      />
      {/* Form */}
      <div className="flex flex-col h-full">
        <div className="flex flex-grow h-full">
          {showVerify ? (
            <div className="flex flex-col mx-auto w-5/6 text-white mt-10">
              <div className="text-lg">{t("misc.enterOTP")}</div>
              <div className="flex justify-center mt-4">
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
                className="bg-white flex justify-center items-center text-black text-[4vw] font-medium py-3 rounded-[10px] mt-6"
              >
                Verify
              </div>
              <div
                onClick={() => {
                  if (countDown === 0) {
                    handleResendOtp();
                  }
                }}
                className="flex cursor-pointer justify-center mt-6 w-full font-medium text-secondary"
              >
                {countDown != 0 ? (
                  <div className="pl-2">{countDown}s</div>
                ) : countDown < 0 ? (
                  <div></div>
                ) : (
                  <div>Resend OTP</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col mx-auto w-5/6 text-white mt-10">
              <div className="w-full mt-1 h-[7vh] border-gray-400 border-2 rounded-[10px]">
                <input
                  type="text"
                  className="w-full text-[4vw] px-2 h-full bg-inherit outline-none"
                  placeholder={t("misc.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex  h-[7vh] gap-2 mt-2 text-[4vw]">
                <div
                  className="flex justify-center rounded-[10px] items-center gap-1 w-[38%] bg-gray-800 cursor-pointer relative"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <h1>{selectedCountry.flag}</h1>
                  <h1>{selectedCountry.dialCode}</h1>
                  <h1 className="text-[3vw]">▼</h1>
                </div>
                <div className="w-full py-3 border-gray-400 border-2 rounded-[10px]">
                  <input
                    type="number"
                    className="w-full text-[4vw] px-2 h-full bg-inherit outline-none"
                    placeholder={t("misc.phone")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              {isDropdownOpen && (
                <div
                  className="absolute mt-2 w-fit max-h-[200px] overflow-auto bg-white text-black rounded-lg z-10"
                  ref={dropdownRef}
                >
                  {availableCountries.map((country) => (
                    <div
                      key={country.code}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <span>{country.flag}</span>
                      <span>
                        {country.name.length > 20
                          ? `${country.name.slice(0, 20)}...`
                          : country.name}
                      </span>
                      <span>{country.dialCode}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex mt-4 gap-2 w-full justify-center items-center text-gray-200">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="-mt-1"
                />
                <div className="text-[3vw]">Accept Terms & Conditions</div>
              </div>
              <div
                onClick={handleGenerateOtp}
                className="bg-white flex justify-center items-center text-black text-[4vw] font-medium py-3 rounded-[10px] mt-6"
              >
                Next
              </div>
            </div>
          )}
        </div>
        <div className=" w-full h-full flex justify-center text-[3vw] text-gray-600">
          <span className="pr-1 underline cursor-pointer">Privacy Policy</span>{" "}
          | @Frogdog Games 2024
        </div>
      </div>
    </div>
  );
};

export default OnboardPage;
