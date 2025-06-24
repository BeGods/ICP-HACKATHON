export const generateNanoId = async () => {
  const { customAlphabet } = await import("nanoid");
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
  return nanoid();
};
