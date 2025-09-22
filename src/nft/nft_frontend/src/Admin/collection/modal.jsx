import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import YellowButton from "../../components/button/YellowButton";
import { v4 as uuidv4 } from "uuid";

const Modal = (props) => {
  const {
    getAddedNftDetails,
    getUpdatedNftDetails,
    cardDetails,
    type,
    toggleModal,
  } = props;

  // Safe initialization
  const safeCardDetails = cardDetails || {};

  const [nftName, setNftName] = useState(
    type === "edit" ? safeCardDetails.nftName || "" : ""
  );
  const [nftType, setNftType] = useState(
    type === "edit" ? safeCardDetails.nftType || "Common" : "Common"
  );
  const [nftQuantity, setNftQuantity] = useState(
    type === "edit" ? safeCardDetails.nftQuantity || "" : ""
  );
  const [nftPrice, setPrice] = useState(
    type === "edit" ? safeCardDetails.nftPrice || "" : ""
  );
  const [nftDescription, setNftDescription] = useState(
    type === "edit" ? safeCardDetails.nftDescription || "" : ""
  );
  const [nftImage, setnftImage] = useState(
    type === "edit" ? safeCardDetails.nftImage || "" : ""
  );
  const [nftcolor, setnftcolor] = useState(
    type === "edit" ? safeCardDetails.nftcolor || "Golden" : "Golden"
  );
  const [arstistname, setartistName] = useState(
    type === "edit" ? safeCardDetails.arstistname || "" : ""
  );
  const [newtype, setnewtype] = useState(
    type === "edit" ? safeCardDetails.newtype || "Quest" : "Quest"
  );
  const [nftSeason, setnftSeason] = useState(
    type === "edit" ? safeCardDetails.nftSeason || "Stone Age" : "Stone Age"
  );
  const [nftFullImage, setnftFullImage] = useState(
    type === "edit" ? safeCardDetails.nftFullImage || "" : ""
  );

  const [hideImageUpload, updateHideImageUploadStatus] = useState(false);

  const validateFields = () => {
    return (
      nftName &&
      nftType &&
      nftQuantity &&
      nftPrice &&
      nftDescription &&
      nftImage &&
      nftcolor &&
      arstistname &&
      newtype &&
      nftSeason &&
      nftFullImage
    );
  };

  const onClickAddButton = () => {
    if (validateFields()) {
      const nftDetails = {
        nftId: uuidv4(),
        nftName,
        nftType,
        nftQuantity,
        nftImage,
        nftPrice,
        nftDescription,
        nftcolor,
        arstistname,
        newtype,
        nftSeason,
        nftFullImage,
      };
      console.log("nft details", nftDetails);
      getAddedNftDetails(nftDetails);
      toggleModal();
      toast.success("Card added successfully!");
    } else {
      toast.error("Enter All NFT Card Details");
    }
  };

  const onClickSaveButton = () => {
    if (validateFields()) {
      const nftDetails = {
        nftId: safeCardDetails.nftId,
        nftName,
        nftType,
        nftQuantity,
        nftImage: nftImage,
        nftPrice,
        nftDescription,
        nftcolor,
        arstistname,
        newtype,
        nftSeason,
        nftFullImage: nftFullImage,
      };
      console.log("nft details", nftDetails);
      getUpdatedNftDetails(nftDetails);
      toggleModal();
      toast.success("Card updated!");
    } else {
      toast.error("Enter All NFT Card Details");
    }
  };

  return (
    <div className="add_new_nft_popup_bg_container">
      <div className="flex items-center justify-end">
        <button className="text-[#ffffff]" onClick={() => toggleModal()}>
          <RxCross2 size={25} />
        </button>
      </div>
      <form className="flex flex-col gap-5">
        {/* NFT Name */}
        <div className="mt-1">
          <label className="text-[#FFFFFF] text-[14px] md:text-[18px]">
            NFT Name
            <input
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              type="text"
              placeholder="Enter your NFT Name"
              className="mt-1 pl-4 w-full h-[38px] bg-[#29292C] rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        {/* Rarity & Artist */}
        <div className="mt-1 flex  gap-2 w-full">
          <div className="w-full flex flex-col sm:w-1/2 text-[#FFFFFF]">
            <div>NFT Rarity:</div>
            <select
              className="h-[38px] bg-[#29292C] p-2 rounded-md text-[#8a8686]"
              value={nftType}
              onChange={(e) => setNftType(e.target.value)}
            >
              <option value="divine">Divine</option>
              <option value="Mythical">Mythical</option>
              <option value="rare">Rare</option>
              <option value="Uncommon">Uncommon</option>
              <option value="common">Common</option>
              <option value="Promo">Promo</option>
              <option value="Misc">Misc</option>
            </select>
          </div>

          <div className="w-full flex flex-col sm:w-1/2 text-[#FFFFFF]">
            <div>Artist Name:</div>
            <input
              value={arstistname}
              onChange={(e) => setartistName(e.target.value)}
              type="text"
              placeholder="Enter Artist Name"
              className="pl-4 rounded-md h-[38px] bg-[#29292C] text-[16px] text-[#8a8686]"
            />
          </div>
        </div>

        {/* NFT Type & Quantity */}
        <div className="mt-1 flex gap-2 w-full">
          <div className="w-full flex flex-col sm:w-1/2 text-[#FFFFFF]">
            <div>NFT Type:</div>
            <select
              className="h-[38px] bg-[#29292C] p-2 rounded-md text-[#8a8686]"
              value={newtype}
              onChange={(e) => setnewtype(e.target.value)}
            >
              <option value="Quest">Quest</option>
              <option value="Char">Char</option>
              <option value="Item">Item</option>
              <option value="Asset">Asset</option>
            </select>
          </div>

          <div className="w-full flex flex-col sm:w-1/2 text-[#FFFFFF]">
            <div>Quantity:</div>
            <input
              value={nftQuantity}
              onChange={(e) => setNftQuantity(e.target.value)}
              type="number"
              min="1"
              className="pl-4 rounded-md h-[38px] bg-[#29292C] text-[16px] text-[#8a8686]"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="mt-1">
          <label className="text-[#FFFFFF]">
            Face Image URL
            <input
              value={nftImage}
              onChange={(e) => setnftImage(e.target.value)}
              type="url"
              placeholder="Enter image URL"
              className="mt-1 pl-4 w-full h-[38px] bg-[#29292C] rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
          {nftImage && (
            <img
              src={nftImage}
              alt="NFT Preview"
              className="mt-2 w-24 h-24 object-cover rounded-md"
            />
          )}
        </div>

        {/* Full Image URL */}
        <div className="mt-1">
          <label className="text-[#FFFFFF]">
            Card Image URL
            <input
              value={nftFullImage}
              onChange={(e) => setnftFullImage(e.target.value)}
              type="url"
              placeholder="Enter full image URL"
              className="mt-1 pl-4 w-full h-[38px] bg-[#29292C] rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
          {nftFullImage && (
            <img
              src={nftFullImage}
              alt="Full NFT Preview"
              className="mt-2 w-24 h-24 object-cover rounded-md"
            />
          )}
        </div>

        {/* Season & Border */}
        <div className="mt-1 flex flex-col gap-2 w-full">
          <div className="w-full flex flex-col sm:w-1/2 text-[#FFFFFF]">
            <div>NFT Season:</div>
            <select
              className="h-[38px] bg-[#29292C] p-2 rounded-md text-[#8a8686]"
              value={nftSeason}
              onChange={(e) => setnftSeason(e.target.value)}
            >
              <option value="Stone Age">Stone Age</option>
              <option value="Golden Age">Golden Age</option>
              <option value="Silver Age">Silver Age</option>
              <option value="Bronze Age">Bronze Age</option>
            </select>
          </div>

          <div className="w-full flex flex-col sm:w-1/2 text-[#FFFFFF]">
            <div>Border Color:</div>
            <select
              className="h-[38px] bg-[#29292C] p-2 rounded-md text-[#8a8686]"
              value={nftcolor}
              onChange={(e) => setnftcolor(e.target.value)}
            >
              <option value="golden">Golden</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="mt-1">
          <label className="text-[#FFFFFF]">
            Price (in ICP)
            <input
              value={nftPrice}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="1"
              className="mt-1 pl-4 w-full h-[38px] bg-[#29292C] rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        {/* Description */}
        <div className="mt-1">
          <label className="text-[#FFFFFF]">
            NFT's Description
            <textarea
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              rows={5}
              className="pl-2 w-full h-[100px] bg-[#29292C] rounded-md mt-1 text-[16px] text-[#8a8686]"
              placeholder="Enter NFT description here"
            />
          </label>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-2 md:mt-3">
          {type === "add" && (
            <YellowButton methodName={onClickAddButton}>Add</YellowButton>
          )}
          {type === "edit" && (
            <YellowButton methodName={onClickSaveButton}>Save</YellowButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default Modal;
