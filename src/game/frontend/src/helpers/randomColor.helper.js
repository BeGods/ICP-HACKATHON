import { mythSections } from "../utils/constants.fof";

export const getRandomColor = () => {
  return mythSections[Math.floor(Math.random() * mythSections.length)];
};
