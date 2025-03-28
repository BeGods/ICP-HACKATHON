import { fourDigitCode } from "../../helpers/general.helpers";
import { client } from "../../config/alibaba";
import {
  deleteRedisKey,
  getOTP,
  setOTP,
  setRequestCnt,
} from "./redis.services";
import config from "../../config/config";

export const generateAliOTP = async (mobileNumber) => {
  try {
    const requestCount = await setRequestCnt(mobileNumber);

    if (requestCount && requestCount > 2) {
      return {
        status: 429,
        message: "You have exceeded the OTP request limit. Try after 1hr.",
      };
    }

    const otp = fourDigitCode();
    const message = `${otp} is your OTP / verification code for FrogDog Games and is valid for 5 minutes. Do not share this with anyone. - Regards, Playsuper`;

    const params = {
      RegionId: "ap-southeast-1",
      To: mobileNumber.replace(/\s/g, ""),
      Message: message,
      From: config.alibaba.senderId,
      channel: config.alibaba.channel,
    };

    await setOTP(mobileNumber.toString(), otp.toString(), 300);

    try {
      const result = await client.request("SendMessageToGlobe", params, {
        method: "POST",
      });

      console.log("SMS sent successfully:", result);
    } catch (error) {
      console.error("Error sending SMS:", error);
      return {
        status: 500,
        message: "Failed to send OTP. Please try again later.",
      };
    }

    return { status: 200, message: "OTP has been sent successfully!" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { status: 500, message: "An unexpected error occurred." };
  }
};

export const verifyOtp = async (mobileNumber, otp) => {
  try {
    const storedOTP = await getOTP(mobileNumber);

    if (!storedOTP) {
      throw new Error("Please generate an OTP to verify.");
    }

    if (storedOTP !== otp) {
      throw new Error("Invalid OTP.");
    }

    await deleteRedisKey(`count_${mobileNumber}`);
    await deleteRedisKey(`${mobileNumber}`);

    return true;
  } catch (error) {
    console.log(error);
    throw Error("Failed to verify otp.");
  }
};
