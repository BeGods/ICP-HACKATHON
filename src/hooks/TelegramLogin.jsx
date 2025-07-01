const TelegramLogin = () => {
  const handleLogin = () => {
    const encodedOrigin = encodeURIComponent(window.location.origin);
    const encodedRedirect = encodeURIComponent(
      "https://2r2cf484-5174.inc1.devtunnels.ms/auth/telegram/callback"
    );

    const loginUrl = `https://oauth.telegram.org/auth?bot_id=7247805953&origin=https://dev.begods.games&request_access=true&return_to=https://dev.begods.games/auth/telegram/callback/`;

    window.location.href = loginUrl;
  };

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

export default TelegramLogin;

// my url
// https://oauth.telegram.org/auth?bot_id=7247805953&origin=https://2r2cf484-5174.inc1.devtunnels.ms&request_access=true&return_to=https://2r2cf484-5174.inc1.devtunnels.ms/auth/telegram/callback/
// one of the app's url where auth works
// https://oauth.telegram.org/auth?bot_id=6831383510&origin=https://totemancer.com&request_access=true&return_to=https://totemancer.com/
// https://oauth.telegram.org/auth?bot_id=6831383510&origin=https://totemancer.com&request_access=true&return_to=https://totemancer.com/
// https://oauth.telegram.org/auth?bot_id=7247805953&origin=https://dev.begods.games&request_access=true&return_to=https://dev.begods.games/
// https://oauth.telegram.org/auth?bot_id=7247805953&origin=https://dev.begods.games&request_access=true&return_to=https://dev.begods.games/
