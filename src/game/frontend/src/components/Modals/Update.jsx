import { Camera, Pencil } from "lucide-react";
import { updateAvatarImage } from "../../utils/api.fof";
import ModalLayout from "../Layouts/ModalLayout";
import { useDisableWrapper } from "../../hooks/disableWrapper";
import { useStore } from "../../store/useStore";

const UpdateModal = () => {
  const authToken = useStore((s) => s.authToken);
  const userData = useStore((s) => s.userData);

  const { wrapWithDisable } = useDisableWrapper();

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
    <ModalLayout>
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
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              wrapWithDisable(() => handleImageUpload(file));
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
    </ModalLayout>
  );
};

export default UpdateModal;
