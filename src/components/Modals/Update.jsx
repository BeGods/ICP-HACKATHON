import React, { useContext, useEffect, useState } from "react";
import { FofContext } from "../../context/context";
import { Camera, Pencil } from "lucide-react";
import { updateAvatarImage } from "../../utils/api.fof";

const UpdateModal = ({ close }) => {
  const { userData, setShowBack, section, authToken } = useContext(FofContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShowBack(section);
    return () => setShowBack(null);
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await updateAvatarImage(formData, authToken);

      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative modal-width w-fit -mt-[2.5rem] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col card-shadow-white p-4"
      >
        <div
          onClick={close}
          className={`absolute cursor-pointer flex w-full justify-end top-0 right-0 -mt-4 -mr-4 `}
        >
          <div className="absolute flex justify-center items-center  bg-black rounded-full w-[40px] h-[40px]">
            <div className="text-white font-roboto text-black-contour text-[1.25rem]">
              {"\u2715"}
            </div>
          </div>
        </div>

        <div className="relative w-32 h-32 mx-auto mt-6">
          <img
            src={userData.avatarUrl}
            onError={() => {}}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-white"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80 transition">
            <Camera className="text-white" size={28} />
            <input
              id="avatarUpload"
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                await handleImageUpload(file);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-x-4 uppercase justify-between items-center text-white px-4 py-2 mt-2">
          <span className="text-[1.5rem]">{userData.username}</span>
          <button className="rounded-full transition">
            <Pencil size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
