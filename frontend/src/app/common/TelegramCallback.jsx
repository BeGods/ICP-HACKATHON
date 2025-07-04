import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authenticateTg, authenticateTgWeb } from "../../utils/api.fof";
import { setAuthCookie } from "../../helpers/cookie.helper";
import { MainContext } from "../../context/context";
import { showToast } from "../../components/Toast/Toast";

const tele = window.Telegram?.WebApp;

const TelegramCallback = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useContext(MainContext);
  const [searchParams] = useSearchParams();

  const telegramAuth = async (hash) => {
    try {
      const response = await authenticateTgWeb({ initData: hash });
      setAuthToken(response.data.accessToken);
      await setAuthCookie(tele, response.data.accessToken);
      navigate(`/`);
    } catch (error) {
      console.error("Authentication Error: ", error);
      navigate(`/`);
    }
  };

  return (
    <div className="text-white p-8">
      <h1 className="text-xl font-bold">Telegram Login Success</h1>
      <p>Check the console for user data.</p>
    </div>
  );
};

export default TelegramCallback;
