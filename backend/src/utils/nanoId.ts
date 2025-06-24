import { customAlphabet } from "nanoid";

export const generateNanoId = () => {
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

  return nanoid();
};
