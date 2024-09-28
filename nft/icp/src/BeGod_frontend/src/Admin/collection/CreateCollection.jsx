import React, { useEffect, useState } from "react";
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
import { Principal } from "@dfinity/principal";
import { Opt } from "@dfinity/candid/lib/cjs/idl.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import WarningModal from "./WarningModal.jsx";
import SuccessModal from "./SuccessModal.jsx";
import toast from "react-hot-toast";

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
  const { backendActor, canisterId } = useAuth();
  const [Ufile, setUFile] = useState([]);
  const [base64String, setBase64String] = useState("");
  const [nfttype, setnfttype] = useState("rare");
  const [nftname, setnftname] = useState("");
  const [nftquantity, setnftquantity] = useState();
  const [nftprice, setnftprice] = useState("");
  const [nftimage, setnftimage] = useState("");
  const [nftbase64, setnftbase64] = useState("");
  const [nftdescription, setnftdescription] = useState("");
  const [canId, setcanId] = useState();
  const [TokenId, setTokenId] = useState("");
  const [tokenidentifier, setTokenidentifier] = useState("");
  const [canprincipal, setcanpricipal] = useState();
  const [mintimagebase, setmintimagebase] = useState();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [collColor, setCollColor] = useState("");
  const [nftcolor, setnftcolor] = useState("");
  const [Success, setsuccess] = useState(false);

  // console.log(Date.now().toLocaleString());
  // const {
  //   nftType,
  //   nftName,
  //   nftQuantity,
  //   nftPrice,
  //   nftDescription,
  //   nftImage,
  //   nftImageURL,
  // } = nftCardsList;

  const { user } = useSelector((state) => state.auth);
  const principal_id = user;

  // backendActor?.CanisterActor?.createExtCollection;
  // console.log(createExtCollection);

  const toggleModal = () => {
    setModal(!modal);
    // callCreateExtCollection();
    // createExtData(name, base64String, nfttype);
  };
  const togglewarning = () => {
    setShowModal(!showModal);
    // setWarningModal(!WarningModal);
  };

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

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const actor = createActor();
  //   try {
  //     const collectionResponse = await actor.add_collection_to_map(
  //       principal_id
  //     );
  //     console.log("Collection created successfully:", collectionResponse);
  //     for (const nft of nftRows) {
  //       const nftResponse = await actor.addNFT({
  //         id: nft.id,
  //         description: nft.description,
  //         collectionId: collectionResponse.collectionId,
  //       });
  //       console.log("NFT created successfully:", nftResponse);
  //     }
  //     navigate("/success");
  //   } catch (error) {
  //     console.error("Error creating collection or NFTs:", error);
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation checks
    if (!name || !description || !Ufile) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // Ensure at least one NFT card is added
    else if (nftCardsList.length === 0) {
      toast.error("Please add at least one NFT card.");
      return;
    } else {
      togglewarning();
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

  const handleFiles = (files) => {
    console.log("Uploaded files:", files);
    setUFile(files);
    const file = files[0];
    if (file) {
      const reader = new FileReader();

      // Convert the file to a Base64 string when it's loaded
      reader.onloadend = () => {
        setBase64String(reader.result); // The base64-encoded string is stored here
      };

      reader.readAsDataURL(file); // Read the file as a Data URL (Base64 format)
    }
  };

  // const getBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const createExtData = async (name, base64String, description, collColor) => {
    try {
      const metadata = JSON.stringify({ description, collColor });
      // console.log(name, base64String, metadata);
      const report = await backendActor?.createExtCollection(
        name,
        base64String,
        metadata
      );

      if (report && Array.isArray(report)) {
        const data = await extractPrincipals(report);
        console.log(data[1]);
        if (data) {
          setcanId(data[1]);
          return data[1];
        } else {
          throw new Error("Create collection is not working");
          toast.error("Create collection is not working");
        }
      } else {
        throw new Error(
          "Unexpected response structure: " + JSON.stringify(report)
        );
        toast.error("Unexpected response structure: " + JSON.stringify(report));
      }
    } catch (error) {
      console.error("Error in createExtData:", error);
      return error;
    }
  };

  const mintNFT = async (
    answ,
    nftname,
    nftdescription,
    nftimage,
    nftquantity,
    nftcolor,
    nftPrice
  ) => {
    try {
      // console.log("in mint", answ);
      const principalString = answ;
      const principal = Principal.fromText(principalString);
      const date = new Date();
      const formattedDate = `${
        date.getMonth() + 1
      }-${date.getDate()}-${date.getFullYear()}`;
      const metadata = JSON.stringify({
        nfttype,
        standard: "EXT V2",
        chain: "ICP",
        contractAddress: canisterId,
        nftcolor,
        date: formattedDate,
      });

      const metadataContainer = {
        json: metadata,
      };
      // console.log(principal, nftname, nftdescription, nftimage, nftquantity);

      const result = await backendActor?.mintExtNonFungible(
        principal,
        nftname,
        nftdescription,
        "thumbnail",
        nftimage,
        metadataContainer ? [metadataContainer] : [],
        Number(nftquantity)
      );

      console.log(result, "nft mint data");
      const es8_price = parseFloat(nftPrice) * 100000000;
      console.log(es8_price, "price");
      if (result && result.length > 0) {
        result.map((val, key) => {
          getNftTokenId(answ, val[1], es8_price);
        });
      }

      // if (result) {
      //   setTokenId(result[0]);
      //   console.log("NFT Minted: ", result[0]);
      //   await getNftTokenId(answ, result[0]);
      // } else {
      //   throw new Error("Error in mintNFT");
      //   toast.error("Error in mintNFT");
      // }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT");
      return error; // Return error
    }
  };

  const getNftTokenId = async (answ, nftIdentifier, nftprice) => {
    try {
      console.log(answ, nftIdentifier, nftprice);
      const principal = Principal.fromText(answ);
      const res = await listPrice(principal, nftIdentifier, nftprice);
      console.log(res, "res data");
    } catch (error) {
      console.error("Error fetching NFT token ID:", error);
      toast.error("Error in getNftTokenId");
      return error;
    }
  };

  const listPrice = async (principal, tokenidentifier, price) => {
    try {
      const finalPrice = price;

      const priceE8s = finalPrice ? finalPrice : null;

      const request = {
        token: tokenidentifier,
        from_subaccount: [],
        price: priceE8s ? [priceE8s] : [],
      };
      const result = await backendActor?.listprice(principal, request);
      if (result) {
        console.log("List Price Result:", result);
        await getListing(principal);
      } else {
        throw new Error("listprice is not working");
        toast.error("listprice is not working");
      }
    } catch (error) {
      console.error("Error listing price:", error);
      toast.error("Error listing price");
      return error; // Return error
    }
  };

  const getListing = async (principal) => {
    try {
      console.log(principal);
      const result = await backendActor?.listings(principal);
      console.log("Listing", result);
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Error fetching listing");
      return error; // Return error
    }
  };

  const getAddedNftDetails = (nftDetails) => {
    setNftCardsList([...nftCardsList, nftDetails]);

    setnfttype(nftDetails.nftType);
    setnftname(nftDetails.nftName);
    setnftquantity(nftDetails.nftQuantity);
    setnftprice(nftDetails.nftPrice);
    setnftdescription(nftDetails.nftDescription);
    setnftimage(nftDetails.nftImage);
    setnftcolor(nftDetails.nftcolor);
  };

  const deleteNft = (nftId) => {
    const updatedNFtList = nftCardsList.filter(
      (eachNft) => eachNft.nftId !== nftId
    );
    setNftCardsList(updatedNFtList);
  };

  const handleUpload = () => {
    console.log("upload clicked");
    togglewarning();
    finalcall();
  };

  const finalcall = async () => {
    setLoading(true); // Start loading
    let hasError = false; // Flag to track if an error occurs

    try {
      const answ = await createExtData(
        name,
        base64String,
        description,
        collColor
      );
      if (answ instanceof Error) {
        hasError = true;
        toast.error(answ);
        throw answ;
      }

      console.log(nftCardsList, "nftCardsList nftCardsList");
      setcanId(answ);
      if (nftCardsList && nftCardsList.length > 0) {
        nftCardsList.map((val, key) => {
          const mintResult = mintNFT(
            answ,
            val.nftName,
            val.nftDescription,
            val.nftImage,
            val.nftQuantity,
            val.nftcolor,
            val.nftPrice
          );
          console.log(mintResult, "minResult");
          if (mintResult instanceof Error) {
            hasError = true;
            throw mintResult;
            toast.error(mintResult);
          }
          setLoading(false);
          if (!hasError) {
            setsuccess(!Success);
            setTimeout(() => {
              navigate("/admin/collection");
            }, 2000);
          }
        });
      }
    } catch (error) {
      console.error("Error in final call: ", error);
      toast.error("Error in final call");
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
        {loading ? (
          <div
            style={{
              display: "grid",
              lineHeight: 3,
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <Skeleton />
            <Skeleton count={5} />
          </div>
        ) : (
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
                        <LogoImageUploader captureUploadedFiles={handleFiles} />
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
                  <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
                    Type color:
                    <select
                      className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md text-[#8a8686]"
                      value={collColor}
                      onChange={(e) => setCollColor(e.target.value)}
                    >
                      <option
                        value="Green"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Green
                      </option>
                      <option
                        value="Blue"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Blue
                      </option>
                      <option
                        value="Golden"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Golden
                      </option>
                      <option
                        value="Orange"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Orange
                      </option>
                    </select>
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
                  <div className="grid grid-row-3 gap-5">
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

                    {/* {loading && (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                    </div>
                  )} */}

                    <button
                      type="button"
                      className="add_new_button flex items-center justify-center px-6 py-2 bg-transperent text-white border rounded-md border-[#d1b471]  h-[40px] w-[180px] "
                      // onClick={finalcall}
                      // onClick={() => setShowModal(true)}
                      onClick={handleSubmit}
                    >
                      Create Collection
                    </button>
                  </div>
                  {showModal && (
                    <WarningModal
                      togglewarning={togglewarning}
                      onUpload={handleUpload}
                    />
                  )}
                  {!showModal && Success && <SuccessModal />}

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
        )}
      </div>
    </SkeletonTheme>
  );
};

export default CreateCollection;
