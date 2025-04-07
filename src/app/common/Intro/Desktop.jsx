import React from "react";

const DesktopScreen = ({ assets }) => {
  return (
    <div className="flex flex-col h-screen justify-center items-center w-screen bg-black">
      <img
        src={
          "https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/qr-code.png"
        }
        alt="qr"
        className="rounded-3xl h-[35%] fof-text-shadow"
      />
      <h1 className="text-white text-[1.5rem] w-[35%] font-medium mt-4 text-center">
        We designed the BeGods app to be fully optimized for mobile use. Simply
        scan the QR code or use Line to start playing!
      </h1>
      {/* //TODO: this can be improved */}
      <div className="mx-auto flex w-fit gap-x-9 justify-between mt-8">
        <div
          onClick={() => {
            window.open("www.battleofgods.io", "_blank");
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Globe_icon-white.svg"
            alt="web"
            className="w-[3rem] cursor-pointer"
          />
        </div>
        <div
          onClick={() => {
            window.open("https://t.me/begods_games", "_blank");
          }}
        >
          <img
            src="https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/telegram.white.png"
            alt="telegram"
            className="w-[3rem] cursor-pointer"
          />
        </div>
        <div
          onClick={() => {
            window.open("https://x.com/BattleofGods_io", "_blank");
          }}
        >
          <img
            src="https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/x.white.png"
            alt="x"
            className="w-[3rem] cursor-pointer"
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
            className="w-[4rem] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopScreen;
