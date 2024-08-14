import React, { useContext } from "react";
import { MyContext } from "../context/context";
import { useTranslation } from "react-i18next";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];

const Footer = () => {
  const { t } = useTranslation();
  const { section, setSection, activeMyth, setActiveMyth } =
    useContext(MyContext);

  const handleSectionChange = (newSection) => {
    if (typeof setSection === "function") {
      setSection(newSection);

      if (activeMyth >= 4) {
        setActiveMyth(0);
      }
    } else {
      console.error("setSection is not a function. Cannot update section.");
    }
  };

  //console.log(t("sections.forges"));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
      className="flex justify-between items-center h-[13%] px-4 pb-1 w-full  text-[10px] text-white uppercase"
    >
      <div
        style={{
          backgroundImage: `url(/assets/uxui/fof.footer.paper_tin.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className={`filter-paper-${mythSections[activeMyth]}`}
      />

      <div
        onClick={() => {
          setSection(0);
        }}
        className={`flex flex-col items-center `}
      >
        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 0
              ? `glow-icon-${mythSections[activeMyth]} text-[70px]`
              : `footer-glow`
          }`}
        >
          F
        </h1>
        <p
          className={`-mt-4 text-[14px] ${
            section == 0 && "font-semibold"
          } footer-glow`}
        >
          {t("sections.forges")}
        </p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(1);
        }}
        className={`flex flex-col items-center`}
      >
        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 1
              ? `glow-icon-${mythSections[activeMyth]} text-[70px]`
              : `footer-glow`
          }`}
        >
          q
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 1 && "font-semibold"} `}>
          {t("sections.quests")}
        </p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(2);
        }}
        className={`flex flex-col items-center  }`}
      >
        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 2
              ? `glow-icon-${mythSections[activeMyth]} text-[70px]`
              : `footer-glow`
          }`}
        >
          Z
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 2 && "font-semibold"}`}>
          {t("sections.boosters")}
        </p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(3);
        }}
        className={`flex flex-col items-center `}
      >
        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 3
              ? `glow-icon-${mythSections[activeMyth]}`
              : `footer-glow`
          }`}
        >
          P
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 3 && "font-semibold"}`}>
          {t("sections.profile")}
        </p>
      </div>
    </div>
  );
};

export default Footer;

// <div
// style={{
//   position: "relative",
//   width: "100%",
// }}
// className="flex justify-between items-center h-[13%] px-4 pb-1 w-full  text-[10px] text-white"
// >
// <div
//   style={{
//     backgroundImage: `url(/assets/uxui/footer.paper_tiny.png)`,
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover",
//     backgroundPosition: "center center",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "100%",
//     width: "100%",
//     zIndex: -1,
//   }}
//   className={`filter-paper-${mythSections[activeMyth]}`}
// />

// <div
//   onClick={() => {
//     setSection(0);
//   }}
//   className={`flex flex-col items-center  ${
//     section !== 0 && "opacity-40"
//   }`}
// >
//   {/* <img
//     src="/icons/home.png"
//     alt="home"
//     className={`h-[30px] w-[30px] mb-0.5 ${
//       section === 0 && `glow-icon-${mythSections[activeMyth]}`
//     }`}
//   />
//   <p>FORGES</p> */}

//   <h1
//     className={`font-symbols text-[60px] -mb-2 ${
//       section === 0 ? `glow-contour` : "glow-contour"
//     }`}
//   >
//     F
//   </h1>
//   <p className={`-mt-4 text-[14px] ${section == 0 && "font-semibold"}`}>
//     FORGES
//   </p>
// </div>
// <div
//   onClick={() => {
//     handleSectionChange(1);
//   }}
//   className={`flex flex-col items-center  ${
//     section !== 1 && "opacity-40"
//   }`}
// >
//   {/* <img
//     src="/icons/open-quest.svg"
//     alt="quests"
//     className={`h-[30px] w-[30px] ${
//       section === 1 && `glow-icon-${mythSections[activeMyth]}`
//     }`}
//   />
//   <p>QUESTS</p> */}

//   <h1
//     className={`font-symbols text-[60px] -mb-2 ${
//       section === 1 ? `glow-booster` : "glow-contour"
//     }`}
//   >
//     q
//   </h1>
//   <p className={`-mt-4 text-[14px] ${section == 1 && "font-semibold"}`}>
//     QUESTS
//   </p>
// </div>
// <div
//   onClick={() => {
//     handleSectionChange(2);
//   }}
//   className={`flex flex-col items-center  ${
//     section !== 2 && "opacity-40"
//   }`}
// >
//   {/* <img
//     src="/icons/booster.svg"
//     alt="booster"
//     className={`h-[30px] w-[30px] ${
//       section === 2 && `glow-icon-${mythSections[activeMyth]}`
//     }`}
//   />
//   <p>BOOSTERS</p> */}

//   <h1
//     className={`font-symbols text-[60px] -mb-2 ${
//       section === 2 ? `glow-booster` : "glow-contour"
//     }`}
//   >
//     Z
//   </h1>
//   <p className={`-mt-4 text-[14px] ${section == 2 && "font-semibold"}`}>
//     BOOSTERS
//   </p>
// </div>
// <div
//   onClick={() => {
//     handleSectionChange(3);
//   }}
//   className={`flex flex-col items-center  ${
//     section !== 3 && "opacity-40 glow-contour"
//   }`}
// >
//   {/* <img
//     src="/icons/user.svg"
//     alt="profile"
//     className={`h-[50px] w-[50px] ${
//       section === 3 && `glow-icon-${mythSections[activeMyth]}`
//     }`}
//   /> */}
//   <h1
//     className={`font-symbols text-[60px] -mb-2 ${
//       section === 3 ? `glow-booster` : "glow-contour"
//     }`}
//   >
//     P
//   </h1>
//   <p className={`-mt-4 text-[14px] ${section == 3 && "font-semibold"}`}>
//     PROFILE
//   </p>
// </div>
// </div>
