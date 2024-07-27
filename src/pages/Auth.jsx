import React, { useEffect, useState } from "react";
import { authenticate } from "../utils/api";
import { useNavigate } from "react-router-dom";

const tele = window.Telegram?.WebApp;

const Auth = (props) => {
  const navigate = useNavigate();
  const getUserData = async () => {
    if (tele) {
      try {
        await tele.ready();
        const { user } = tele.initDataUnsafe || {};
        if (!tele.isExpanded) tele.expand();

        if (user) {
          const userData = {
            initData: tele?.initData,
          };
          auth(userData);
        } else {
          console.warn("No user found in Telegram data");
        }
      } catch (error) {
        console.error("Error fetching user data from Telegram:", error);
      }
    } else {
      console.warn("Telegram WebApp is not available");
    }
  };

  const auth = async (userData) => {
    try {
      const response = await authenticate(userData);
      tele.CloudStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("accessToken", response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Authentication Error: ", error);
      setRes(error.message);
    }
  };

  useEffect(() => {
    auth();
    getUserData();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-red-400">
      <div className="flex flex-col justify-center items-center p-4">
        <h1>hi</h1>
      </div>
    </div>
  );
};

export default Auth;
