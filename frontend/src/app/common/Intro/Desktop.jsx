import React from "react";

const DesktopScreen = ({ assets }) => {
  return (
    <div className="flex flex-col tg-container-height justify-center items-center w-screen bg-black">
      <img
        src={assets.logos.fofQr}
        alt="qr"
        className="rounded-3xl h-1/2 fof-text-shadow"
      />
      <h1 className="text-white text-secondary w-2/3 font-medium mt-4 text-center">
        We designed the BeGods app to be fully optimized for mobile use. Simply
        scan the QR code or use Telegram to start playing!
      </h1>
      {/* //TODO: this can be improved */}
      <div className="mx-auto flex w-[80%] justify-between mt-8">
        <div
          onClick={() => {
            window.open("www.battleofgods.io", "_blank");
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Globe_icon-white.svg"
            alt="web"
            className="h-[14vw] w-[14vw]"
          />
        </div>
        <div
          onClick={() => {
            window.open("https://t.me/begods_games", "_blank");
          }}
        >
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/telegram-white-icon.png"
            alt="telegram"
            className="h-[14w] w-[14vw]"
          />
        </div>
        <div
          onClick={() => {
            window.open("https://x.com/BattleofGods_io", "_blank");
          }}
        >
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png"
            alt="x"
            className="h-[13vw] w-[13vw]"
          />
        </div>
        <div
          onClick={() => {
            window.open("https://discord.com/invite/Ac7h7huthN", "_blank");
          }}
        >
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
            alt="discord"
            className="h-[14vw] w-[14vw]"
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopScreen;
