import config from "../../config/config";
import axios from "axios";
import PublitioAPI from "publitio_js_sdk";
const fs = require("fs");

const publitio = new PublitioAPI(config.cdn.CDN_API_KEY, config.cdn.CDN_SECRET);

export const getProfilePhotoUrl = async (user) => {
  try {
    const getUserProfilePhotosResponse = await axios.get(
      `https://api.telegram.org/bot${config.security.TMA_BOT_TOKEN}/getUserProfilePhotos`,
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
      `https://api.telegram.org/bot${config.security.TMA_BOT_TOKEN}/getFile`,
      {
        params: {
          file_id: firstPhotoFileId,
        },
      }
    );

    const { file_path } = getFileResponse.data.result;

    return `https://api.telegram.org/file/bot${config.security.TMA_BOT_TOKEN}/${file_path}`;
  } catch (error) {
    console.error("Error:", error.message);
    throw Error(error.message);
  }
};

export const storeImage = async (user) => {
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
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      "Failed to store image on Publitio. Please try again later."
    );
  }
};

export const deleteImage = async (fileId) => {
  try {
    const response = await publitio.call(`/files/delete/${fileId}`, "DELETE");
    console.log("File deleted:", response);
  } catch (error) {
    console.log(error);
  }
};

export const checkImage = async (user) => {
  try {
    const response = await publitio.call(`/files/show/WWB8XiJa`, "GET");
    console.log(response);
  } catch (error) {
    console.log(error);

    throw new Error("Failed to delete profileImage on pubilitio.");
  }
};

export const listImages = async () => {
  try {
    let allImages = [];
    const itemsPerPage = 100;
    const totalItems = 1500;
    let offset = 0;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let page = 0; page < totalPages; page++) {
      const response = await publitio.call("/files/list", "GET", {
        folder: "UserAvatars",
        offset: offset,
        limit: itemsPerPage,
      });

      if (response.files && Array.isArray(response.files)) {
        allImages = [...allImages, ...response.files];
      }

      console.log(`Fetched page ${page + 1} of ${totalPages}`);
      offset += itemsPerPage;
    }

    console.log(allImages.length);

    const listOfImages = allImages.map((file) => {
      const userId = file.title;
      return {
        fileId: file.id,
        _id: userId,
      };
    });

    fs.writeFileSync(
      "listOfImages.json",
      JSON.stringify(listOfImages, null, 2)
    );

    console.log("Images saved to listOfImages.json");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to list profile images on Publitio.");
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
