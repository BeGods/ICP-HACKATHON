import React from "react";
import { generateStarInvoice } from "../utils/api";
const tele = window.Telegram?.WebApp;

const Test = (props) => {
  const handleGenerateInvoice = async () => {
    try {
      const response = await generateStarInvoice();

      await tele.openInvoice(response.invoice, (status) => {
        console.log(status);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="bg-white text-back text-[2vw] p-3">Pay</div>
    </div>
  );
};

export default Test;
