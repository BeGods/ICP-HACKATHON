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
