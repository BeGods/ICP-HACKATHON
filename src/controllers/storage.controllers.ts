import User from "../models/user.models";
import axios from "axios";
import PublitioAPI from "publitio_js_sdk";
import config from "../config/config";

const publitio = new PublitioAPI(config.cdn.CDN_API_KEY, config.cdn.CDN_SECRET);

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

export const testStoreImage = async (userData) => {
  const user = userData;

  try {
    const profileImg = await getProfilePhotoUrl(user);

    if (profileImg) {
      const imageBuffer = await axios({
        method: "get",
        url: profileImg,
        responseType: "arraybuffer",
      }).then((response) => Buffer.from(response.data, "binary"));

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
            "profile.updatedAt": new Date().toISOString(),
          },
        }
      );

      console.log(`Image added successfully for user: ${user._id}`);
      return { success: true, user };
    } else {
      console.log(`Image not found for user: ${user._id}`);
      return { success: false, user };
    }
  } catch (error) {
    console.log(`Error processing user: ${user._id}`, error);
    return { success: false, user };
  }
};

// export const runProfileScript = async (req, res) => {
//   const usersArray = [
//     {
//       _id: new mongoose.Types.ObjectId("66fe21620121a67a4ba25292"),
//       telegramId: "664419138",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("66fe3cc30121a67a4ba2545c"),
//       telegramId: "6027265719",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("66fe6d3f0121a67a4ba258ac"),
//       telegramId: "1686661582",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("66fe8d4d0121a67a4ba2598a"),
//       telegramId: "5144549259",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("66ff78940121a67a4ba25c4e"),
//       telegramId: "521195839",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("66ffcfe3b68c373ec5db2185"),
//       telegramId: "1126065318",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6701f493b68c373ec5db2c15"),
//       telegramId: "1676251947",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67052d84246abe7048ba6418"),
//       telegramId: "525269961",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67052d85246abe7048ba641f"),
//       telegramId: "223847526",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67052d87246abe7048ba6428"),
//       telegramId: "6565545107",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67052d8c246abe7048ba6430"),
//       telegramId: "5285749988",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67052e79246abe7048ba6439"),
//       telegramId: "2066250171",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6705358b246abe7048ba6490"),
//       telegramId: "1899177203",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67053c3d246abe7048ba66b5"),
//       telegramId: "1630981992",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6706ae8f246abe7048ba6e17"),
//       telegramId: "1143659315",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("670780dedc73fd7df585cfdc"),
//       telegramId: "6482812034",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6707bec64dd7264ee4dbbd8e"),
//       telegramId: "5363570615",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("670adab64dd7264ee4dbc674"),
//       telegramId: "5466789816",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("671110044dd7264ee4dbcfb0"),
//       telegramId: "1943599186",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67128aaa4dd7264ee4dbd2ed"),
//       telegramId: "6965163476",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6714c61f4dd7264ee4dbd85a"),
//       telegramId: "5791088192",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67161d891c565a01c6c35196"),
//       telegramId: "5096036806",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67205f1755163d0b939030b2"),
//       telegramId: "801483052",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67234281625426d3a6373fbd"),
//       telegramId: "1306084215",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67237a8ed86cb72d663f0839"),
//       telegramId: "8092092883",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffa4"),
//       telegramId: "5791672720",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffac"),
//       telegramId: "6362625342",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffb4"),
//       telegramId: "289929663",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffbb"),
//       telegramId: "136124728",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffc2"),
//       telegramId: "7035183565",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffca"),
//       telegramId: "7183117971",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffd1"),
//       telegramId: "6868147347",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffd8"),
//       telegramId: "404743770",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffdf"),
//       telegramId: "530601447",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffe6"),
//       telegramId: "912523341",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7ffee"),
//       telegramId: "7354253228",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7fff5"),
//       telegramId: "6853414476",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa7fffc"),
//       telegramId: "511185503",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa80003"),
//       telegramId: "7377828709",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa8000b"),
//       telegramId: "6763356235",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b03f92ee06f5fa80012"),
//       telegramId: "32974784",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80019"),
//       telegramId: "527727632",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80020"),
//       telegramId: "5355486211",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80028"),
//       telegramId: "7103681057",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80030"),
//       telegramId: "7475371203",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80038"),
//       telegramId: "5707413345",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa8003f"),
//       telegramId: "6646233495",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80047"),
//       telegramId: "5420904938",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa8004f"),
//       telegramId: "7182592607",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80056"),
//       telegramId: "5982154472",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa8005d"),
//       telegramId: "6970258981",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80064"),
//       telegramId: "7003199770",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa8006b"),
//       telegramId: "423150090",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80072"),
//       telegramId: "492015585",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80079"),
//       telegramId: "6819803770",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80081"),
//       telegramId: "976100286",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa80088"),
//       telegramId: "1860217938",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b04f92ee06f5fa8008f"),
//       telegramId: "600197549",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b05f92ee06f5fa80096"),
//       telegramId: "1071746717",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b05f92ee06f5fa8009d"),
//       telegramId: "2130736861",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b05f92ee06f5fa800a4"),
//       telegramId: "7236245122",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b05f92ee06f5fa800ab"),
//       telegramId: "7373844099",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b05f92ee06f5fa800b3"),
//       telegramId: "6229868906",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67291b05f92ee06f5fa800ba"),
//       telegramId: "953146071",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672a2090f92ee06f5fa80448"),
//       telegramId: "1405754245",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672a2202f92ee06f5fa80488"),
//       telegramId: "694337905",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672cdd42baf2bccd731809ec"),
//       telegramId: "5265574523",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672dbe5bbaf2bccd73180ef0"),
//       telegramId: "5782754841",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672dbe5dbaf2bccd73180f03"),
//       telegramId: "5122260363",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672e1273baf2bccd731810d1"),
//       telegramId: "5625008128",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672ee3cfbaf2bccd73181b02"),
//       telegramId: "744444217",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672ee920baf2bccd73181b42"),
//       telegramId: "5623286086",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672f019abaf2bccd73181c13"),
//       telegramId: "516341138",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("672f1ecabaf2bccd73182138"),
//       telegramId: "1153749532",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67303700baf2bccd7318255f"),
//       telegramId: "485582441",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6730455cbaf2bccd73182693"),
//       telegramId: "7134673230",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6731a9f4baf2bccd7318415a"),
//       telegramId: "498384967",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67320391baf2bccd7318439d"),
//       telegramId: "996047788",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6732177ebaf2bccd731843b6"),
//       telegramId: "550334235",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67321ac9baf2bccd731843e2"),
//       telegramId: "122385602",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6732715abaf2bccd731844ac"),
//       telegramId: "335676364",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6732c043baf2bccd73184616"),
//       telegramId: "6349152526",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6732ce21baf2bccd7318469a"),
//       telegramId: "7095923953",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67330757baf2bccd73184c93"),
//       telegramId: "6233460374",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67333e31baf2bccd73185938"),
//       telegramId: "838483503",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67335615baf2bccd731859f8"),
//       telegramId: "1351871475",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("67336ee3baf2bccd73185a57"),
//       telegramId: "6926758192",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6735cc92baf2bccd7318824d"),
//       telegramId: "507258792",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("6735cd94baf2bccd731882c9"),
//       telegramId: "1194442548",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("673b31c9baf2bccd73193ede"),
//       telegramId: "6190145945",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("673c3210baf2bccd73197ec5"),
//       telegramId: "6301888170",
//     },
//     {
//       _id: new mongoose.Types.ObjectId("673eeafbbaf2bccd731a0d40"),
//       telegramId: "5140844130",
//     },
//   ];

//   const successfulUsers = [];
//   const failedUsers = [];

//   try {
//     for (const userData of usersArray) {
//       const result = await testStoreImage(userData);

//       if (result.success) {
//         successfulUsers.push(result.user);
//       } else {
//         failedUsers.push(result.user);
//       }
//     }

//     res.status(200).json({
//       message: "Script completed",
//       successfulUsers,
//       failedUsers,
//     });
//   } catch (error) {
//     console.log("Error while running the script:", error);
//     res.status(500).json({ message: "Script failed", error });
//   }
// };
