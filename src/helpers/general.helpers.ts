export const areObjectsEqual = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);

  for (let key of obj1Keys) {
    if (obj1[key] < obj2[key]) {
      return false;
    }
  }

  return true;
};

export const fourDigitCode = () => {
  const result = Math.floor(1000 + Math.random() * 9000);
  return result.toString();
};

export const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const isVaultActive = (date) => {
  if (Date.now() < date) {
    return true;
  }

  return false;
};
