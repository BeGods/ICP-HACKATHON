import { useEffect, useState } from "react";
import { RiFolder6Line, RiDeleteBinLine } from 'react-icons/ri';
import { RxCross2 } from "react-icons/rx";

function LogoImageUploader() {
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [hideUpload, setHideUpload] = useState(false);
  const [fileType , setFileType] = useState("file");
  // const {captureUploadedNftImage} = props

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
    setFileType("file");
  
  }, [files]);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setFileType("file")
    }, 1000);

    return () => clearTimeout(timer);
  },[fileType])

  const toggleInputHide = () => {
      setHideUpload(!hideUpload);
      setPreviews(null);
      setFileType("none")
      
  } 
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
        style={{display:'none'}}
      />
      )}
      {!hideUpload && (
        <div 
        className="flex justify-end items-center pr-2  bg-[#29292C] h-[30px] md:h-[47px] m-0 rounded-md"
        
      >
        <RiFolder6Line className="cursor-pointer"  />
      </div>
      )}
      {previews &&
        previews.map((pic) => {
          return (
            <div className="relative w-[80px] h-[80px] m-0">
            <img 
              src={pic} 
              alt="Selected" 
              className="object-cover w-full h-full rounded-full"
            />
            <button
              onClick={toggleInputHide}
              className="absolute top-0 right-0 bg-white rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 pt-[1px] pl-[1px] "
            >
              <RxCross2 className="text-black" size={13} />
            </button>
          </div>
          )
        })}
    </div>
  );
}

export default LogoImageUploader;