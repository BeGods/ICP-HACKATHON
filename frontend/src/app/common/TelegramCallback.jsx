import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const TelegramCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const data = {};
    for (const [key, value] of searchParams.entries()) {
      data[key] = value;
    }

    console.log("✅ Telegram login data:", data);

    // TODO: Send to backend for verification
    // fetch("/api/telegram/verify", { method: "POST", body: JSON.stringify(data) })
  }, [searchParams]);

  return (
    <div className="text-white p-8">
      <h1 className="text-xl font-bold">Telegram Login Success</h1>
      <p>Check the console for user data.</p>
    </div>
  );
};

export default TelegramCallback;
