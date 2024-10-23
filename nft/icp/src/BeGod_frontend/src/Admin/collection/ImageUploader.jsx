import { useEffect, useState } from "react";
import { RiFolder6Line, RiDeleteBinLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

function ImageUploader(props) {
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [hideUpload, setHideUpload] = useState(false);
  const [fileType, setFileType] = useState("file");
  const { captureUploadedNftImage, captureUploadedNftImageFile, capturefile } =
    props;

  // Rendering previews and sending both files and previews to parent
  useEffect(() => {
    if (!files || files.length === 0) return;

    // Create preview URLs for each file
    const objectUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(objectUrls);
    captureUploadedNftImageFile(files);

    // Cleanup function to revoke object URLs and free memory
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFileType("file");
    }, 1000);

    return () => clearTimeout(timer);
  }, [fileType]);

  const toggleInputHide = () => {
    setHideUpload(!hideUpload);
    setPreviews();
  };

  const onClickDeleteImage = () => {
    setFileType("none");
    setHideUpload(!hideUpload);
    setPreviews();
    setFiles();
  };

  return (
    <div className="mt-1">
      {!hideUpload && (
        <input
          type={fileType}
          accept="image/jpg, image/jpeg, image/png"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFiles(e.target.files);
              toggleInputHide();
            }
          }}
          style={{ display: "none" }}
          className="w-0 h-0"
        />
      )}
      {!hideUpload && (
        <div className="flex justify-end items-center pr-1 bg-[#29292C] h-[38px] m-0 rounded-md">
          <RiFolder6Line className="cursor-pointer" />
        </div>
      )}
      {previews &&
        previews.map((pic, index) => {
          captureUploadedNftImage(pic);
          return (
            <div
              key={index}
              className="relative w-[50px] h-[50px] md:h-[70px] m-0"
            >
              <img
                src={pic}
                alt="Selected"
                className="object-cover w-full h-full rounded-lg"
              />
              <button
                onClick={onClickDeleteImage}
                className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
              >
                <RxCross2 className="text-black" size={15} />
              </button>
            </div>
          );
        })}
    </div>
  );
}

export default ImageUploader;
