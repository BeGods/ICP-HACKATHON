import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { authenticateTgWeb } from "../utils/api.fof";
import { setAuthCookie } from "../helpers/cookie.helper";
import { useStore } from "../store/useStore";
import { getAuth, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../utils/firebase";

const tele = window.Telegram?.WebApp;

export const useTwitterAuth = () => {
  const auth = getAuth(firebaseApp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithTwitter = useCallback(async () => {
    setLoading(true);
    const provider = new TwitterAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const loggedInUser = result.user;
      const data = loggedInUser.reloadUserInfo?.providerUserInfo?.[0];
      const twitterUsername = data.screenName;

      if (token) {
        return { token: token, twitterUsername: twitterUsername };
      }

      return null;
    } catch (err) {
      console.error("Twitter login failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return {
    loginWithTwitter,
    loading,
    error,
  };
};

export const TelegramLogin = () => {
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const setAuthToken = useStore((s) => s.setAuthToken);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.onload = () => {
      setIsTelegramReady(true);
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    if (isTelegramReady && window.Telegram && window.Telegram.Login) {
      window.Telegram.Login.auth(
        {
          bot_id: "7247805953",
          request_access: true,
        },
        function (user) {
          if (user) {
            const params = new URLSearchParams();
            params.append("id", user.id);
            params.append("first_name", user.first_name);
            params.append("username", user.username);
            params.append("photo_url", user.photo_url);
            params.append("auth_date", user.auth_date);
            params.append("hash", user.hash);

            window.location.href =
              "https://2r2cf484-5174.inc1.devtunnels.ms?" + params.toString();
          } else {
            console.error("Telegram login failed or was cancelled.");
          }
        }
      );
    } else {
      console.error("Telegram Login JS SDK not loaded yet.");
    }
  };

  const handleWebAuth = async (fullUrl) => {
    try {
      const response = await authenticateTgWeb({ fullUrl: fullUrl });
      setAuthToken(response.data.accessToken);
      await setAuthCookie(tele, response.data.accessToken);
      window.location.reload();
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  useEffect(() => {
    const data = {};
    for (const [key, value] of searchParams.entries()) {
      data[key] = value;
    }

    const fullUrl = window.location.href;

    if (data && searchParams && searchParams.get("hash")) {
      (async () => await handleWebAuth(fullUrl))();
    }
  }, [searchParams]);

  return (
    <button
      onClick={handleLogin}
      className="flex justify-center items-center cursor-pointer bg-gray-700 hover:bg-gray-600 transition w-full py-2.5 rounded-lg"
    >
      <img
        src="https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/telegram02.png"
        alt="Telegram"
        className="w-6 h-6 mr-2"
      />
    </button>
  );
};
