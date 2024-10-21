import PublitioAPI from "publitio_js_sdk";
import fs from "fs";

// Initialize Publitio with your API key and secret
const publitio = new PublitioAPI("<API key>", "<API secret>");

export const storeImage = async () => {
  const filePath = "/src/hexagon.png";
  try {
    // Read the image file from your file system
    const data = fs.readFileSync(filePath);

    // Upload the image to Publitio with a specific folder and title
    const response = await publitio.uploadFile(filePath, "file", {
      privacy: "public",
      folder: "avatars", // Specify the folder
      title: "test1", // Set the custom title
      description: "A sample image", // Optionally add a description
    });

    console.log("File uploaded successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to upload the image:", error);
    throw error;
  }
};
