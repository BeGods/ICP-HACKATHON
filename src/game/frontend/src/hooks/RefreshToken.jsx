import { useEffect, useState, useRef } from "react";
import { getExpCookie } from "../helpers/cookie.helper";

export const useTokenCountdown = (tele, handleRefreshToken) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const countdownRef = useRef(null);

  try {
    const tokenExp = "";
    if (!tokenExp) return;

    const refreshTime = tokenExp + 30 * 1000;
    const now = Date.now();
    let remainingTime = refreshTime - now;

    setTimeLeft(remainingTime > 0 ? remainingTime : 0);

    if (remainingTime <= 0) {
      console.log("Token expired, refreshing now...");
      handleRefreshToken();
      return;
    }

    // Clear any existing interval
    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(countdownRef.current);
          console.log("Token expired, refreshing now...");
          handleRefreshToken();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  } catch (error) {
    console.error("Error fetching token expiry:", error);
  }
};
