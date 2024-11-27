import React, { useContext } from "react";
import { MyContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";

const ProfileInfoCard = ({ close }) => {
  const { t, i18n } = useTranslation();
  const { assets, userData } = useContext(MyContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.info}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>
        <div className="absolute top-0 w-full text-center text-card text-paperHead font-bold mt-2 uppercase z-30">
          {t("sections.profile")}
        </div>

        <div
          className={`absolute leading-[18px] text-paperSub uppercase text-card inset-0 w-[85%] mx-auto flex flex-col justify-start pt-[30%] font-[550] z-30 ${
            (i18n.language === "hi" ||
              i18n.language === "th" ||
              i18n.language === "ru") &&
            "font-normal"
          }`}
        >
          <div className="flex flex-col gap-y-4">
            <div>
              {t("profile.invite")}: {userData.directReferralCount}
            </div>
            <div>
              {t("profile.player")}: {userData.overallRank}
            </div>
          </div>
        </div>

        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={1} />
      </div>
    </div>
  );
};

export default ProfileInfoCard;
