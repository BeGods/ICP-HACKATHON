import User from "../models/user.models";
import axios from "axios";
import PublitioAPI from "publitio_js_sdk";

const publitio = new PublitioAPI(
  "i6q1Luk3DsHBBnlqQdei",
  "7iHww0J32lnWyl3vd2mi9cGRx89vHm4k"
);

export const storeImage = async (req, res) => {
  const user = req.user;

  try {
    const profileImg = await getProfilePhotoUrl(user);

    if (profileImg) {
      const imageBuffer = await axios({
        method: "get",
        url: profileImg,
        responseType: "arraybuffer",
      }).then((response) => {
        return Buffer.from(response.data, "binary");
      });

      const response = await publitio.uploadFile(imageBuffer, "file", {
        folder: "UserAvatars",
        title: `avatar_${user._id}`,
        public_id: `avatar_${user._id}`,
      });

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            "profile.avatarUrl": response.public_id,
            updatedAt: new Date().toISOString(),
          },
        }
      );
      res.status(201).json({ data: response });

      // res.status(201).json({ avatarUrl: response.public_id });
    } else {
      res.status(201).json({ avatarUrl: null });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getFolders = async (req, res) => {
  try {
    publitio
      .call("/folders/list", "GET", {})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export async function getProfilePhotoUrl(user) {
  try {
    const getUserProfilePhotosResponse = await axios.get(
      `https://api.telegram.org/bot7247805953:AAF97zXNNzc5WP9sbkfB8oLOaWMotFUnHq0/getUserProfilePhotos`,
      {
        params: {
          user_id: Number(user.telegramId),
        },
      }
    );

    const { photos } = getUserProfilePhotosResponse.data.result;

    if (photos.length === 0) {
      return null;
    }

    const firstPhotoFileId = photos[0][0].file_id;

    const getFileResponse = await axios.get(
      `https://api.telegram.org/bot7247805953:AAF97zXNNzc5WP9sbkfB8oLOaWMotFUnHq0/getFile`,
      {
        params: {
          file_id: firstPhotoFileId,
        },
      }
    );

    const { file_path } = getFileResponse.data.result;

    return `https://api.telegram.org/file/bot7247805953:AAF97zXNNzc5WP9sbkfB8oLOaWMotFUnHq0/${file_path}`;
  } catch (error) {
    console.error("Error:", error.message);
    throw Error(error.message);
  }
}
