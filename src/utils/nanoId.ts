const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateNanoId = (length: number = 6): string => {
  let id = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * ALPHABET.length);
    id += ALPHABET[index];
  }
  return id;
};
