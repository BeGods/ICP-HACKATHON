export const areObjectsEqual = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);

  for (let key of obj1Keys) {
    if (obj1[key] < obj2[key]) {
      return false;
    }
  }

  return true;
};
