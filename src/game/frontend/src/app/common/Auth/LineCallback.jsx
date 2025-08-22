import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authenticateLine } from "../../../utils/api.fof";
import { setAuthCookie } from "../../../helpers/cookie.helper";
import { useStore } from "../../../store/useStore";

const tele = window.Telegram?.WebApp;

const LineCallback = () => {
  const setAuthToken = useStore((s) => s.setAuthToken);
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");

  const lineAuth = async () => {
    try {
      const response = await authenticateLine(null, code);
      setAuthToken(response.data.accessToken);
      await setAuthCookie(tele, response.data.accessToken);
      navigate(`/`);
    } catch (error) {
      console.error("Authentication Error: ", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!code) {
      console.error("No authorization code found!");
      navigate("/");
      return;
    }

    (async () => await lineAuth())();
  }, [navigate, location]);
  return <></>;
};

export default LineCallback;
