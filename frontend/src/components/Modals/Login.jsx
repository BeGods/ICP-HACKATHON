import { useContext, useState } from "react";
import { MainContext } from "../../context/context";

export default function LoginModal() {
  const { assets } = useContext(MainContext);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-sm p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center gap-4">
        {/* Logo & Title */}
        <div className="flex justify-start gap-x-4 items-center w-full">
          <img
            draggable={false}
            src={assets.logos.begodsBlack}
            alt="logo"
            className="w-[50px] pointer-events-none select-none"
          />
          <div>
            <h1 className="font-semibold text-xl">Sign in</h1>
            <h2 className="text-sm text-gray-400">
              Explore the world's largest mythoverse!
            </h2>
          </div>
        </div>

        {/* Section 1: Social logins */}
        <div className="flex justify-center gap-3 mt-2 w-full">
          {[
            {
              alt: "Telegram",
              src: "https://i.postimg.cc/4y0fzKWX/telegram-white-icon.png",
            },
            {
              alt: "LINE",
              src: "https://i.postimg.cc/6p0b1N66/line-icon.png",
            },
            {
              alt: "X",
              src: "https://i.postimg.cc/VsZkyTm2/x-social-media-white-icon.png",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 transition w-full py-2.5 rounded-lg"
            >
              <img src={item.src} alt={item.alt} className="w-5 h-5" />
            </div>
          ))}
        </div>

        {/* Section 2: Mobile input */}
        <div className="flex flex-col gap-4 mt-1 w-full">
          <div className="flex border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
            <button className="flex items-center justify-center w-[30%] px-3 bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition">
              {countryCode} ▼
            </button>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-3 text-base bg-gray-800 outline-none text-white placeholder-gray-500"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button className="w-full py-2.5 text-base font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition">
            Get OTP
          </button>

          <p className="text-center text-sm text-gray-400">
            Don’t have an account?
            <span className="ml-1 font-medium text-white cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>

        <div className="text-center text-sm text-gray-500">OR</div>

        {/* Section 3: Wallet connect */}
        <button className="w-full bg-green-500 text-white py-3.5 rounded-lg font-medium transition text-sm">
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
