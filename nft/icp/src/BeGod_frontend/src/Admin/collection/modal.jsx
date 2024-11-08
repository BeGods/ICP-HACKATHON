import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";
import YellowButton from "../../components/button/YellowButton";
import imageCompression from "browser-image-compression";

const Modal = (props) => {
  const { getAddedNftDetails } = props;
  const [nftId, setNftId] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftType, setNftType] = useState("Common");
  const [nftQuantity, setNftQuantity] = useState();
  const [nftPrice, setPrice] = useState();
  const [nftDescription, setNftDescription] = useState("");
  const [nftImage, setNftImage] = useState();
  const [nftImageURL, setNftImageURL] = useState("");
  const { toggleModal } = props;
  const [nftcolor, setnftcolor] = useState("Golden");
  const [arstistname, setartistName] = useState("");
  const [newtype, setnewtype] = useState("Quest");
  const [nftSeason, setnftSeason] = useState("Stone Age");

  const nnftid = () => {
    const value = Math.floor(Math.random() * 1000000);
    setNftId(value);
  };

  useEffect(() => {
    nnftid();
  }, []);

  const onClickAddButton = () => {
    // event.preventDefault();
    if (
      nftId &&
      nftName &&
      nftType &&
      nftQuantity &&
      nftPrice &&
      nftDescription &&
      nftImage &&
      nftImageURL &&
      nftcolor &&
      arstistname &&
      newtype &&
      nftSeason
    ) {
      const nftDetails = {
        nftId,
        nftName,
        nftType,
        nftQuantity,
        nftImage,
        nftImageURL,
        nftPrice,
        nftDescription,
        nftcolor,
        arstistname,
        newtype,
        nftSeason,
      };
      console.log("nft details", nftDetails);
      getAddedNftDetails(nftDetails);
      toggleModal();
      toast.success("NFT Card Added");
    } else {
      toast.error("Enter All NFT Card Details");
    }
  };

  const captureUploadedNftImageFile = async (files) => {
    const file = files[0];
    if (file) {
      try {
        let options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 300,
          useWebWorker: true,
        };
        let compressedFile = await imageCompression(file, options);

        while (compressedFile.size > 100 * 1024) {
          options.maxSizeMB *= 0.9;
          compressedFile = await imageCompression(file, options);
        }

        console.log("Compressed file size:", compressedFile.size);

        const reader = new FileReader();
        reader.onloadend = () => setNftImage(reader.result);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error during file compression:", error);
      }
    }
  };

  const captureUploadedNftImage = (pic) => {
    setNftImageURL(pic);
    console.log(nftImageURL);
    // console.log("img", files);
  };

  return (
    <div className="add_new_nft_popup_bg_container">
      <div className="flex items-center justify-end">
        <button className="text-[#ffffff]" onClick={() => toggleModal()}>
          <RxCross2 size={25} />
        </button>
      </div>
      <form className="flex flex-col gap-5">
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            NFT Name
            <input
              value={nftName}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "") {
                    setNftName(value);
                  } else {
                    setNftName("");
                  }
                } else {
                  toast.error("Only letters and numbers are allowed.");
                }
              }}
              type="text"
              placeholder="Enter your NFT Name"
              className="mt-1 pl-4 w-[100%] h-[38px] bg-[#29292C] rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:gap-2 md:flex-row md:gap-2 w-full h-[120px] md:h-[60px] mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            NFT Rarity:
            <select
              className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md text-[#8a8686]"
              value={nftType}
              onChange={(e) => setNftType(e.target.value)}
            >
              <option value="divine" className="text-[16px] text-[#8a8686]">
                Divine
              </option>
              <option value="Mythical" className="text-[16px] text-[#8a8686]">
                Mythical
              </option>
              <option value="rare" className="text-[16px] text-[#8a8686]">
                Rare
              </option>
              <option value="uncommon" className="text-[16px] text-[#8a8686]">
                Uncommon
              </option>
              <option value="common" className="text-[16px] text-[#8a8686]">
                Common
              </option>
              <option value="Promo" className="text-[16px] text-[#8a8686]">
                Promo
              </option>
              <option value="Misc" className="text-[16px] text-[#8a8686]">
                Misc
              </option>
            </select>
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px] ">
            Artist Name:
            <input
              value={arstistname}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "") {
                    setartistName(value);
                  } else {
                    setartistName("");
                  }
                } else {
                  toast.error("Only letters and numbers are allowed.");
                }
              }}
              type="text"
              placeholder="Enter Artist Name"
              className="pl-4 rounded-md h-[60px] p-2 bg-[#29292C] text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full h-[120px] md:h-[60px] mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            NFT Type:
            <select
              className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md text-[#8a8686]"
              value={newtype}
              onChange={(e) => setnewtype(e.target.value)}
            >
              <option value="Quest" className="text-[16px] text-[#8a8686]">
                Quest
              </option>
              <option value="Char" className="text-[16px] text-[#8a8686]">
                Char
              </option>
              <option value="Item" className="text-[16px] text-[#8a8686]">
                Item
              </option>
              <option value="Asset" className="text-[16px] text-[#8a8686]">
                Asset
              </option>
            </select>
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            Quantity:
            <input
              value={nftQuantity}
              onChange={(e) => {
                const value = e.target.value;
                if (value < 0) {
                  toast.error("Enter a valid natural number greater than 0");
                  setNftQuantity("");
                } else {
                  setNftQuantity(value);
                }
              }}
              type="number"
              min="1"
              className="pl-4 rounded-md h-[38px] p-2 bg-[#29292C] text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-1">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            Image
            <ImageUploader
              captureUploadedNftImage={captureUploadedNftImage}
              captureUploadedNftImageFile={captureUploadedNftImageFile}
            />
          </label>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full h-[120px] md:h-[60px] mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            NFT Season:
            <select
              className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md text-[#8a8686]"
              value={nftSeason}
              onChange={(e) => setnftSeason(e.target.value)}
            >
              <option value="Stone Age" className="text-[16px] text-[#8a8686]">
                Stone Age
              </option>
              <option value="Golden Age" className="text-[16px] text-[#8a8686]">
                Golden Age
              </option>
              <option value="Silver Age" className="text-[16px] text-[#8a8686]">
                Silver Age
              </option>
              <option value="Bronze Age" className="text-[16px] text-[#8a8686]">
                Bronze Age
              </option>
            </select>
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            Border Color:
            <select
              className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md text-[#8a8686]"
              value={nftcolor}
              onChange={(e) => setnftcolor(e.target.value)}
            >
              <option value="golden" className="text-[16px] text-[#8a8686]">
                Golden
              </option>
              <option value="silver" className="text-[16px] text-[#8a8686]">
                Silver
              </option>
              <option value="bronze" className="text-[16px] text-[#8a8686]">
                Bronze
              </option>
            </select>
          </label>
        </div>

        <div className="mt-1">
          <label className="mt-[20px] w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
            Price (in ICP)
            <input
              value={nftPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (value < 0) {
                  toast.error("Enter a valid natural number greater than 0");
                  setPrice("");
                } else {
                  setPrice(value);
                }
              }}
              type="number"
              min="1"
              className="pl-4 w-[100%] h-[38px] bg-[#29292C] rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-1">
          <label className="w-[100%] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
            NFT's Description
            <textarea
              value={nftDescription}
              onChange={(e) => {
                const value = e.target.value;

                if (value.trim() !== "") {
                  setNftDescription(value);
                } else {
                  setNftDescription("");
                }
              }}
              rows={5}
              className="pl-2 w-[100%] h-[100px] bg-[#29292C] rounded-md mt-1 text-[16px] text-[#8a8686]"
              placeholder="Enter NFT description here"
            />
          </label>
        </div>
        <div className="flex justify-center mt-2 md:mt-3">
          <YellowButton methodName={() => onClickAddButton()}>Add</YellowButton>
          {/* <button
            type="submit"
            className="h-[38px] w-[150px] border-0 bg-[#FCD37B] text-[#000000] rounded-sm"
            onClick={onClickAddButton}
          >
            ADD
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default Modal;
