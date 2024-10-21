import { mythSections } from "../utils/constants";

export const getRandomColor = () => {
  return mythSections[Math.floor(Math.random() * mythSections.length)];
};
