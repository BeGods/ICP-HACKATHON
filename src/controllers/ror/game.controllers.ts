import { fetchGameData } from "../../services/ror/game.services";

export const getGameStats = async (req, res) => {
  const user = req.user;
  const userId = user._id;

  try {
    const userGameData = await fetchGameData(userId);

    res.status(200).json({ mythData: userGameData.userMythologies });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
