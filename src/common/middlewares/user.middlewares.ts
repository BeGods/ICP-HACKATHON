export const validateFinishedRwrd = async (req, res, next) => {
  const user = req.user;

  try {
    if (user.gameCompletedAt.hasClaimedFoFRwrd) {
      throw new Error("FOF Finish reward has been already claimed");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to validate user.",
      error: error.message,
    });
  }
};

export const validateWithdrawRwrd = async (req, res, next) => {
  const user = req.user;
  const { type } = req.body;
  const amount = user.holdings[type] ?? 0;

  try {
    // chekc valid balance
    if (type === "usdt" && amount < 1) {
      throw new Error(`Failed to withdraw. Atleast need 1 ${type}.`);
    }

    if (type !== "usdt" && amount < 10) {
      throw new Error(`Failed to withdraw. Atleast need 10 ${type}.`);
    }

    // check wallet connected
    if (!user.kaiaAddress) {
      throw new Error(`Failed to withdraw. Wallet not connected.`);
    }

    req.amount = amount;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};
