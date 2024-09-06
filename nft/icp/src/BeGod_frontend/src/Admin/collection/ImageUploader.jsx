import { useEffect, useState } from "react";
import { RiFolder6Line, RiDeleteBinLine } from 'react-icons/ri';
import { RxCross2 } from "react-icons/rx";

function ImageUploader(props) {
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [hideUpload, setHideUpload] = useState(false);
  const [fileType , setFileType] = useState("file");
  const {captureUploadedNftImage} = props

  // rendering previews
  useEffect(() => {
    if (!files) return;
    let tmp = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(files[i]));
    }
    const objectUrls = tmp;
    setPreviews(objectUrls);

    // free memory
    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
    
  
  }, [files]);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setFileType("file")
    }, 1000);

    return () => clearTimeout(timer);
  },[fileType])

  const toggleInputHide = () => {
      setHideUpload(!hideUpload);
      setPreviews();
  }
  const onClickDeleteImage = () => {
    setFileType("none");
    setHideUpload(!hideUpload);
    setPreviews();
    setFiles();

  }

  


  

  return (
    <div className="m-0">
      <br />
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
        style={{display:'none'}}
      />
      )}
      {!hideUpload && (
        <div 
        className="flex justify-end items-center pr-1 bg-[#29292C] h-[30px] m-0"
        
      >
        <RiFolder6Line className="cursor-pointer"  />
      </div>
      )}
      {previews &&
        previews.map((pic) => {
          captureUploadedNftImage(pic)
          return (
            <div className="relative w-[50px] h-[70px] m-0">
            <img 
              src={pic} 
              alt="Selected" 
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={onClickDeleteImage}
              className="absolute top-0 right-0 bg-white rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
            >
              <RxCross2 className="text-black" size={15} />
            </button>
          </div>
          )
        })}
    </div>
  );
}

export default ImageUploader;