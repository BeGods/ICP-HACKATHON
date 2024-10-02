import React, { useContext, useState } from "react";
import IconButton from "../Buttons/IconButton";
import { MyContext } from "../../context/context";
import { fetchOTP, verifyOtp } from "../../utils/api";

const AuthOTP = ({ handleClose }) => {
  const { authToken, setUserData } = useContext(MyContext);
  const [phoneNo, setPhoneNo] = useState(0);
  const [otp, setOtp] = useState(0);
  const [showVerify, setShowVerify] = useState(false);

  const handleGenerateOtp = async () => {
    setShowVerify(true);
    try {
      await fetchOTP(phoneNo, authToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(phoneNo, otp, authToken);
      setUserData((prevState) => {
        return {
          ...prevState,
          isPlaysuperVerified: true,
        };
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-start items-center z-50">
      <div className="relative w-[76%] bg-[#1D1D1D] rounded-primary mt-[52px] card-shadow-white p-6 flex flex-col justify-center items-center">
        <IconButton align={0} handleClick={handleClose} activeMyth={4} />
        <div className="text-white text-center break-words w-2/3 mx-auto mt-4">
          Verify with Playsuper
        </div>
        {!showVerify ? (
          <div className="w-full mt-2 flex flex-col items-center">
            <div className="flex justify-center items-center w-full">
              <div className="text-white h-10 pr-1 mt-4 text-2xl">+91</div>
              <input
                onChange={(e) => setPhoneNo(e.target.value)}
                type="number"
                className="w-full px-2 py-2 h-10 bg-[#1D1D1D] border text-white rounded-lg text-2xl"
              />
            </div>
            <div
              onClick={handleGenerateOtp}
              className="w-full bg-white text-black text-center text-xl rounded-md py-2 mt-6 cursor-pointer"
            >
              Get OTP
            </div>
          </div>
        ) : (
          <>
            <div className="w-full mt-6 flex flex-col items-center">
              <div className="flex justify-center items-center w-full">
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  type="number"
                  className="w-full px-2 py-2 h-10 bg-[#1D1D1D] border text-white rounded-lg text-2xl"
                />
              </div>
              <div
                onClick={handleVerifyOtp}
                className="w-full bg-white text-black text-center text-xl rounded-md py-2 mt-6 cursor-pointer"
              >
                Verify
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthOTP;
