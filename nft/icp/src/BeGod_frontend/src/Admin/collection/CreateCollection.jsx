import React, { useState } from "react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import DropzoneWithUrlInput from "../components/DropzoneWithUrlInput";
import { Switch } from "@chakra-ui/react";
import { idlFactory } from "../../../../declarations/BeGod_backend/BeGod_backend.did.js";
import { canisterId } from "../../../../declarations/BeGod_backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import { useSelector } from "react-redux";
import Modal from "./modal.jsx";
import NftCardItem from "./NftCardItem.jsx";
import LogoImageUploader from "./LogoImageUploader.jsx";
import { GoPlus } from "react-icons/go";
import { BiPlus } from "react-icons/bi";
import BackButton from "./BackButton.jsx";
import YellowButton from "../../components/button/YellowButton.jsx";
import { useAuth } from "../../utils/useAuthClient.jsx";

const CreateCollection = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [limit, setLimit] = useState(0);
  const [logo, setLogo] = useState(null);
  const [nfts, setNfts] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [nftRows, setNftRows] = useState([{ id: "", description: "" }]); // Initial row
  const [modal, setModal] = useState(false);
  const [nftCardsList, setNftCardsList] = useState([]);
  const { backendActor } = useAuth();

  const { user } = useSelector((state) => state.auth);
  const principal_id = user;

  //  backendActor?.CanisterActor?.createExtCollection;
  //   console.log(createExtCollection)

  const toggleModal = () => setModal(!modal);

  const handleAddRow = () =>
    setNftRows([...nftRows, { id: "", description: "" }]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...nftRows];
    updatedRows[index][field] = value;
    setNftRows(updatedRows);
  };

  const handleLogoChange = (file) => setLogo(file);

  const createActor = () => {
    const agent = new HttpAgent();
    return Actor.createActor(idlFactory, { agent, canisterId });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const actor = createActor();
    try {
      const collectionResponse = await actor.add_collection_to_map(
        principal_id
      );
      console.log("Collection created successfully:", collectionResponse);
      for (const nft of nftRows) {
        const nftResponse = await actor.addNFT({
          id: nft.id,
          description: nft.description,
          collectionId: collectionResponse.collectionId,
        });
        console.log("NFT created successfully:", nftResponse);
      }
      navigate("/success");
    } catch (error) {
      console.error("Error creating collection or NFTs:", error);
    }
  };

  const extractPrincipals = async (response) => {
    try {
      const principalArray = response.map((principalObj) => {
        return principalObj.toText();
      });
      return principalArray;
    } catch (error) {
      console.error("Error extracting principals:", error);
    }
  };

  const createExtData = async (name, description, limit) => {
    console.log(name, description, limit);
    // const report  = await backendActor?.createExtCollection("chandan","vishwakarma","2");
    // if (report && Array.isArray(report)) {
    //   const data = await extractPrincipals(report);
    //   console.log(data)
    // } else {
    //   console.error("Unexpected response structure:", report);
    // }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getAddedNftDetails = (nftDetails) => {
    setNftCardsList([...nftCardsList, nftDetails]);
  };

  const deleteNft = (nftId) => {
    const updatedNFtList = nftCardsList.filter(
      (eachNft) => eachNft.nftId !== nftId
    );
    setNftCardsList(updatedNFtList);
  };

  return (
    <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
      <div className="w-full">
        <BackButton />
        <div className="my-8">
          <h1 className="text-3xl text-white ">Create Collection</h1>
          <div className="flex flex-col md:flex-row gap-x-8 items-center  w-full  px-1 py-2 text-[#FFFFFF] justify-start rounded-md">
            <form className="flex flex-col w-full gap-2 mt-4 space-y-4">
              {/* Collection Name and Max Limit */}
              <div className="flex flex-col items-center justify-center w-full sm:flex-row sm:gap-4 md:flex-row md:gap-4">
                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-2">
                    Collection Name:
                  </label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="pl-4 rounded-md bg-[#29292C] h-[30px] md:h-[45px] w-full"
                  />
                </div>
                <div className="w-full sm:w-1/2 flex flex-col mt-[20px] sm:mt-0">
                  <label className="w-full flex flex-col mt-[20px] sm:mt-0">
                    <span className="text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-2">
                      Logo
                    </span>
                    <LogoImageUploader />
                  </label>
                </div>
              </div>
              {/* Description */}
              <label className="mt-[20px] w-[100%] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
                Description:
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-4 w-[100%] h-[100px] bg-[#29292C] rounded-md resize-none p-2"
                  rows="8"
                  placeholder="Enter description here"
                />
              </label>
              {/* Add new NFT Section */}
              <div
                className={`${
                  nftCardsList.length > 0 && "flex justify-end items-center"
                }`}
              >
                <label className="mt-[20px] w-[100%]  md:h-[46px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-[0px]">
                  NFT Cards
                </label>
                <br />
                <div className="relative inline-block py-2 mt-2">
                  <button
                    type="button"
                    className="add_new_button flex items-center justify-center px-6 py-2 bg-transperent text-white border border-[#d1b471] rounded-l-full rounded-r-none h-[40px] w-[180px] "
                    onClick={toggleModal}
                  >
                    Add New
                  </button>
                  <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-[#f0c96a] w-[40px] h-[40px] rounded-full flex items-center justify-center border-2 border-gray-900">
                    <span>
                      <BiPlus size={22} />{" "}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                {nftCardsList.map((eachNftItem) => (
                  <NftCardItem
                    nftDetails={eachNftItem}
                    key={eachNftItem.nftId}
                    deleteNft={deleteNft}
                  />
                ))}
              </div>
              {/* Form Buttons */}
              <div className="flex justify-start sm:justify-end md:justify-end gap-4 w-[100%] mt-[10px] pb-8 sm:mb-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-[30%] sm:w-[25%] md:w-[15%] h-[43px] text-[#FFFFFF] rounded-md border-[#FCD37B] border font-semibold"
                >
                  Cancel
                </button>
                <YellowButton
                  methodName={() => createExtData(name, description, limit)}
                >
                  Create Collection
                </YellowButton>
              </div>
              {modal && (
                <div className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen">
                  <div className="w-screen h-screen top-0 left-0 right-0 bottom-0 fixed bg-[rgba(49,49,49,0.8)]">
                    <div className="flex items-center justify-center h-screen">
                      <Modal
                        toggleModal={toggleModal}
                        getAddedNftDetails={getAddedNftDetails}
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
