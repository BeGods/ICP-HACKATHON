import { useAuth } from "../utils/useAuthClient";
import ICPLoginButton from "../../../../game/frontend/src/components/Buttons/ICPBtn";
import { X } from "lucide-react";
import { useEffect } from "react";

const LoginModal = ({ onClose, isOpen }) => {
  const { login, plugConnectMobile } = useAuth();
  const { backendActor, isAuthenticated, principal } = useAuth({});

  if (!isOpen) return null;

  const buttonDataArray = [
    {
      imgSrc: "/wallets/plug2-logo.png",
      color: "#3a86ff",
      name: "Plug",
      methodName: () => plugConnectMobile(),
    },
    {
      imgSrc: "/wallets/stoic-logo.png",
      color: "#f9c74f",
      name: "Stoic",
      methodName: () => login("stoic"),
    },
    {
      imgSrc: "/wallets/nfid-logo.png",
      color: "#ff006e",
      name: "NFID",
      methodName: () => login("nfid"),
    },
    {
      imgSrc: "/wallets/icp-logo.png",
      color: "#8338ec",
      name: "Identity",
      methodName: () => login("ii"),
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated]);

  return (
    <div className="fixed inset-0  bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4 no-scrollbar">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-sm w-full text-white overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src="https://media.publit.io/file/BeGods/logos/frogdog.games.black.svg"
              alt="Logo"
              className="h-10 w-auto"
            />

            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Connect
              </h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="space-y-4 p-4">
          {buttonDataArray.map((value, key) => (
            <ICPLoginButton
              key={key}
              imgSrc={value.imgSrc}
              name={value.name}
              color={value.color}
              methodName={value.methodName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
