import React, { useEffect, useState, CSSProperties } from "react";
import Navbar from "../components/Landing Page Components/Navbar";
import Footer from "../components/Footer";
import YellowButtonUserSide from "../components/button/YellowButtonUserSide";
import { CiStar } from "react-icons/ci";
import { CiShare2 } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { RiFileCopyLine } from "react-icons/ri";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import MoonLoader from "react-spinners/MoonLoader";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FiLock } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { transferApprove } from "../utils/transApprove";
import { ToastContainer, toast } from "react-toastify";
import ReactTimeAgo from 'react-time-ago'
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const buyingStatus = {
  payment: "PAYMENT",
  success: "SUCCESS",
};


import shareOptions from "./shareOptions.jsx";


const BuyNft = () => {
  const [buyPopup, setbuyPopup] = useState(false);
  const [currentBuyingStatus, setBuyingStatus] = useState(buyingStatus.payment);
  const [cardDetails, setCardDetails] = useState({});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const collectionId = params.get("collectionId");
  const index = params.get("index");
  const { backendActor, ledgerActor, principal } = useAuth({});
  const [nftCardLoading, setNftCardLoading] = useState(true);
  const [isDisplayBuyNow,updateIsDisplayBuyNow] = useState(true);

  const [collectionDetails, setCollectionDetails] = useState({});
  const [collectionDetailsLoading, setCollectionDetailsLoading] =
    useState(true);
    const [showError,setShowError]=useState({
      show:false,
      msg:""
    });

  const [tokenId, setTokenId] = useState("");

  let [popUpFirstLoading, setLoadingFirst] = useState(true);
  let [popUpSecondLoading, setLoadingSecond] = useState(false);
  let [color, setColor] = useState("#ffffff");


  const [sharePopup,updateSharePopup] = useState(false);
  const toggleBuyPopup = () => {
    setbuyPopup(!buyPopup);
    setBuyingStatus(buyingStatus.payment);
  };

  const sendBalance = async (purchaseTxnId, UserAccountId, Price) => {
    const transactionArg = {
      to: { owner: Principal.fromText(purchaseTxnId), subaccount: [] },
      from_subaccount: [], // Optional: set subaccount if needed
      amount: { e8s: Price },
      fee: { e8s: 10000 },
      memo: 0,
      created_at_time: null,
    };
    console.log(transactionArg, "transationarg");
    const result = await ledgerActor?.icrc1_transfer(transactionArg);
    console.log("final result", result);
    // console.log(result.ok);
    // console.log("result type", typeof result.ok);
  };

  const encodeIcrcAccount = (principalText) => {
    const principal = Principal.fromText(principalText);
    const subAccount = null; // Use null for default subaccount

    // Convert Principal to AccountIdentifier
    const accountIdentifier = AccountIdentifier.fromPrincipal(
      principal,
      subAccount
    );

    return accountIdentifier.toHex(); // This returns the account ID in hex format
  };

  const onClickBuyButton = async () => {
    setShowError({show:false,msg:""});
    setLoadingFirst(true);
    setLoadingSecond(false);
    setBuyingStatus(buyingStatus.payment);

    if (isAuthenticated) {
      setbuyPopup(true);
      setBuyingStatus(buyingStatus.payment);

      const result1 = await backendActor?.purchaseNft(
        Principal.fromText(collectionId),
        tokenId,
        parseInt(cardDetails.cardPrice),
        principal
      );

      console.log(
        Principal.fromText(collectionId),
        tokenId,
        parseInt(cardDetails.cardPrice),
        principal,
        "data check"
      );
      setLoadingFirst(false);
      setLoadingSecond(true);
      console.log("payment address", result1.ok[0]);
      const transationId = result1.ok[0];
      const subAccount = [];
      console.log("principal", principal);
      const resultTxn = await transferApprove(
        backendActor,
        ledgerActor,
        parseInt(cardDetails.cardPrice),
        Principal.fromText(principal),
        transationId,
        collectionId,
        subAccount
      );
      console.log(resultTxn, "this is the finale result");
      if (resultTxn === true) {
        setLoadingSecond(false);
        updateIsDisplayBuyNow(false);
        setBuyingStatus(buyingStatus.success);
        toast.success("Payment Success!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Payment Failed!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setShowError({show:true,msg:resultTxn.error});
        setLoadingFirst(false);
        setLoadingSecond(false);
        setBuyingStatus(buyingStatus.payment);
      }
    } else {
      toast.error("Login First!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // console.log("collectionId",collectionId);
  // console.log("card index",index);

  const { t } = useTranslation();
  const {
    detailsText,
    contactAddress,
    token,
    tokenStandard,
    chain,
    lastUpdated,
    buyNow,
  } = t("buyNowDetails");

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const fetchCardDetails = async () => {
    console.log(collectionId, index);
    const result = await backendActor?.getSingleNonFungibleTokens(
      Principal.fromText(collectionId),
      parseInt(index)
    );
     console.log("buying nft details" , result);
    // console.log("buying nft details 0 1" , result[0][1]);
    // console.log("buying nft details 0 2" , result[0][2].nonfungible.metadata[0]);
    // console.log("buying nft details 2" , result[2]);
    // console.log(result, "result");
    const parsedMetadata = {
      nftTypes: [],
      standards: [],
      chains: [],
    };

    const cardDetails = result[0][2].nonfungible;
    // const metadata = JSON.parse(cardDetails.metadata[0].json);
    const cardPrice = parseInt(result[0][3]);
    let date;
    cardDetails?.metadata.forEach((item) => {
      const parsedData = JSON.parse(item.json);
      console.log(parsedData);
      parsedMetadata.nftTypes.push(parsedData.nfttype);
      parsedMetadata.standards.push(parsedData.standard);
      parsedMetadata.chains.push(parsedData.chain);
      date = parsedData.date;
    });

    const updatedCardDetails = {
      cardName: cardDetails?.name,
      cardType: parsedMetadata?.nftTypes,
      cardImageUrl: cardDetails?.thumbnail,
      cardDescription: cardDetails?.description,
      cardPrice: cardPrice,
      standards: parsedMetadata.standards,
      chains: parsedMetadata.chains,
      date : date,
      contactAddress:result[0][1],
    };
    console.log("updated Card Details", updatedCardDetails)
    setCardDetails(updatedCardDetails);
    setNftCardLoading(false);
  };

  useEffect(() => {
    fetchCardDetails();
  }, []);

  const fetchTokenId = async () => {
    const tokenId = await backendActor?.getNftTokenId(
      Principal.fromText(collectionId),
      parseInt(index)
    );

    setTokenId(tokenId);
  };
  useEffect(() => {
    fetchTokenId();
  }, []);

  const fetchCollectionDetails = async () => {
    const result = await backendActor?.getAllCollections();
    const collectionItems = result[0][1];
    collectionItems.map((eachItem) => {
      // console.log("each item collection id",eachItem[1]);
      // console.log("");
      // console.log("collection Id" , Principal.fromText(collectionId))

      if (collectionId === eachItem[1].toString()) {
        // console.log("inside")
        setCollectionDetails({
          collectionId: collectionId,
          collectionName: eachItem[2],
          collectionDescription: JSON.parse(eachItem[4])?.description,
        });
        setCollectionDetailsLoading(false);
        return;
      }
    });
  };

  useEffect(() => {
    fetchCollectionDetails();
  }, []);

  return (
    <div className={`font-caslon ${buyPopup && "fixed"}`}>
      <div
        style={{
          backgroundImage: `url('/Hero/smoke 1.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Navbar />
        <div className="max-w-[1920px] mx-auto mt-8 sm:mt-8 w-full flex flex-col  items-center justify-center gap-4">
          <img src="/Hero/frame.svg" alt="" className="w-[20%]" />
          <div className="h-[4px] w-[94%] rounded-lg border"></div>
        </div>

        {/* for mobile screen */}
        <div className="max-w-[1920px] mx-auto mt-8 flex flex-col xl:hidden items-center justify-center overflow-hidden ">
          <div className="w-[80%] flex text-white justify-between items-center">
            <div className="h-[2vh] w-[10%]">
              <CiStar className="object-cover w-full h-full" />
            </div>
            {nftCardLoading ? (
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <div className="flex flex-col items-center justify-center">
                  <Skeleton count={1} width={100} height={50} />
                  <Skeleton count={1} width={70} height={20} />
                </div>
              </SkeletonTheme>
            ) : (
              <div className="space-y-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]">
                <h1 className="text-[50px] sm:text-[64px] font-[400] leading-[54px]">
                  {cardDetails ? cardDetails.cardName : <Skeleton />}
                </h1>
                <h2 className="text-[16px] font-[400] leading-[14px] text-center capitalize">
                  {cardDetails ? cardDetails.cardType : <Skeleton />}
                </h2>
              </div>
            )}
            <div onClick={()=>updateSharePopup(!sharePopup)}>
            <CiShare2 />
            </div>
          </div>
          <div className="flex items-center mt-16">
            <div>
              <div
                className="w-full h-full rounded-lg shadow-lg"
                style={{ boxShadow: "0px 0px 94px 36px #06B225" }}
              >
                {nftCardLoading ? (
                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <div className="w-full h-full">
                      <Skeleton height={320} width={280} />
                    </div>
                  </SkeletonTheme>
                ) : (
                  <img
                    src={cardDetails?.cardImageUrl}
                    alt=""
                    className="object-cover w-full h-full rounded-lg shadow-lg"
                    style={{ boxShadow: "0px 0px 20.8px 5px #000000" }}
                  />
                )}
              </div>
              {/* <div className='mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]' onClick={() => setbuyPopup(!buyPopup)}>
                                <YellowButtonUserSide>{t('buyNow')}</YellowButtonUserSide>
                            </div> */}
              {nftCardLoading && isDisplayBuyNow ? (
                <div className="mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#202020]">
                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <Skeleton count={1} width={178} height={40} />
                  </SkeletonTheme>
                </div>
              ) : (
                (isDisplayBuyNow && (
                  <div className="mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]">
                  <button
                    className="w-full bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                    disabled={nftCardLoading}
                    onClick={onClickBuyButton}
                  >
                    Buy for {cardDetails.cardPrice / 100000000} ICP
                  </button>
                </div>
                ))
              )}
            </div>
          </div>
          <h1 className="w-[90%] mt-8 text-center text-[24px] font-[500] leading-[28px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]">
            {nftCardLoading ? (
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton count={3} width="100%" height={20} />
              </SkeletonTheme>
            ) : (
              cardDetails.cardDescription
            )}
          </h1>
          <div className="mt-8 h-[4px] w-[80%] rounded-lg border"></div>
          <div className="mt-8 w-[80%] flex flex-col space-y-2">
            <h1 className="text-[24px] font-[500] leading-[28px] text-[#FFFFFF]">
              Details
            </h1>
            {nftCardLoading ? (
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton count={5} height={20} />
              </SkeletonTheme>
            ) : (
              <>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  <h1>{contactAddress}</h1>
                  <h1>{cardDetails.contactAddress}</h1>
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  <h1>{token}</h1>
                  <h1>ID8050</h1>
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  <h1>{tokenStandard}</h1>
                  <h1>ERC-721</h1>
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  <h1>{chain}</h1>
                  <h1>ICP</h1>
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  <h1>{lastUpdated}</h1>
                  <h1>7 Days ago</h1>
                </div>
              </>
            )}
          </div>
          <div className="mt-8 h-[4px] w-[80%] rounded-lg border"></div>
        </div>

        {/* For desktop screen */}
        <div
          className="max-w-[1920px] mx-auto hidden xl:flex xl:w-[100%] 2xl:w-[93%]  items-center justify-center"
          style={{
            backgroundImage: `url('/Hero/green BG.svg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="hidden w-full sm:flex">
            <div className="mt-8 w-[50%] flex flex-col space-y-8 ml-[10%]">
              <div className="flex justify-between w-full text-white ">
                <div className="h-[20px]">
                  <CiStar className="object-cover w-full h-full cursor-pointer" />
                </div>

                {nftCardLoading ? (
                  <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                    <div className="flex flex-col items-center justify-center">
                      <Skeleton count={1} width={100} height={50} />
                      <Skeleton count={1} width={70} height={20} />
                    </div>
                  </SkeletonTheme>
                ) : (
                  <div className="flex flex-col gap-1 space-y-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]">
                    <h1 className="text-[64px] font-[400] leading-[54px]">
                      {cardDetails.cardName}{" "}
                    </h1>
                    <h2 className="text-[16px] font-[400] leading-[14px] text-center capitalize">
                      {cardDetails.cardType}
                    </h2>
                  </div>
                )}
                <div className="h-[20px]" onClick={()=>updateSharePopup(!sharePopup)}>
                  <CiShare2 className="object-cover w-full h-full cursor-pointer" />
                </div>
              </div>
              {nftCardLoading ? (
                <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                  <div className="flex flex-col items-center justify-center">
                    <Skeleton count={4} width={600} height={20} />
                  </div>
                </SkeletonTheme>
              ) : (
                <h1 className="ml-[10%] w-[80%] text-center text-[24px] font-[500] leading-[28px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]">
                  {cardDetails?.cardDescription}
                </h1>
              )}

              <div className="ml-[10%] w-[80%] flex flex-col space-y-2">
                <h1 className="text-[24px] font-[500] leading-[28px] text-[#FFFFFF]">
                  {detailsText}
                </h1>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  {nftCardLoading ? (
                    <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                      <Skeleton count={1} width={140} height={20} />
                      <Skeleton count={1} width={140} height={20} />
                    </SkeletonTheme>
                  ) : (
                    <>
                      <h1>{contactAddress}</h1>
                      <h1>{cardDetails.contactAddress.slice(0,4)}...{cardDetails.contactAddress.slice(-4)}</h1>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  {nftCardLoading ? (
                    <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                      <Skeleton count={1} width={140} height={20} />
                      <Skeleton count={1} width={140} height={20} />
                    </SkeletonTheme>
                  ) : (
                    <>
                      <h1>{token}</h1>
                      <h1>ID8050</h1>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  {nftCardLoading ? (
                    <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                      <Skeleton count={1} width={140} height={20} />
                      <Skeleton count={1} width={140} height={20} />
                    </SkeletonTheme>
                  ) : (
                    <>
                      <h1>{tokenStandard}</h1>
                      <h1>{cardDetails?.standards}</h1>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  {nftCardLoading ? (
                    <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                      <Skeleton count={1} width={140} height={20} />
                      <Skeleton count={1} width={140} height={20} />
                    </SkeletonTheme>
                  ) : (
                    <>
                      <h1>{chain}</h1>
                      <h1>{cardDetails?.chains[0]}</h1>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]">
                  {nftCardLoading ? (
                    <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                      <Skeleton count={1} width={140} height={20} />
                      <Skeleton count={1} width={140} height={20} />
                    </SkeletonTheme>
                  ) : (
                    <>
                      <h1>{lastUpdated}</h1>
                      <h1><ReactTimeAgo date={cardDetails.date} locale="en" /></h1>
                    </>
                  )}
                </div>
              </div>
              {nftCardLoading && isDisplayBuyNow && (
                <div className="ml-[40%]  w-[190px] lg:w-[195px] p-2 border-[1px] border-[#202020]">
                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <Skeleton count={1} width={178} height={40} />
                  </SkeletonTheme>
                </div>  
              )}
              {!nftCardLoading && isDisplayBuyNow && (
                (isDisplayBuyNow && (
                  <div className="ml-[40%]  w-[190px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]">
                  <button
                    className="w-full bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                    disabled={nftCardLoading}
                    onClick={onClickBuyButton}
                  >
                    Buy for {cardDetails.cardPrice / 100000000} ICP
                  </button>
                  
                </div>
                
                ))
              )}
              
            </div>
            <div>
              {nftCardLoading ? (
                <div className="h-[60%] w-[80%] mt-[40%] ml-[50%] shadow-lg rounded-lg">
                  <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                    <Skeleton
                      count={1}
                      height={320}
                      width={250}
                      className="object-cover border-none rounded-lg shadow-lg"
                    />
                  </SkeletonTheme>
                </div>
              ) : (
                <div
                  className="h-[20rem] w-[15rem] mt-[40%] ml-[50%] shadow-lg rounded-lg"
                  style={{ boxShadow: "0px 0px 94px 36px #06B225" }}
                >
                  <img
                    src={cardDetails?.cardImageUrl}
                    alt=""
                    className="object-cover w-full h-full rounded-lg shadow-lg"
                    style={{ boxShadow: "0px 0px 20.8px 5px #000000" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative max-w-[1920px] mx-auto mt-8 pb-8 w-[100%] flex flex-col md:flex-row items-center justify-center">
          <div className="flex items-center justify-center xl:hidden  w-[100%] xl:w-[130%] lg:pl-[3%]">
            <img src="/Hero/celtic_hero.png" alt="" />
          </div>
          <div className="hidden xl:flex w-[100%] xl:w-[130%] lg:pl-[3%]">
            <img src="/Hero/Mask group.png" alt="" />
          </div>

          <div className="flex flex-col items-center justify-center md:items-start w-[100%] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] space-y-4">
            {collectionDetailsLoading ? (
              <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                <Skeleton count={1} height={70} width={150} />
                <Skeleton count={3} width={280} height={15} />
              </SkeletonTheme>
            ) : (
              <>
                <h1 className="sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border">
                  {collectionDetails?.collectionName}
                </h1>
                <h2 className="text-center sm:text-start w-[90%] lg:w-[70%]">
                  {collectionDetails?.collectionDescription}
                </h2>
              </>
            )}
          </div>
          <div className="absolute top-0 left-8">
            <img src="/Hero/Vector.png" alt="" />
          </div>
          <div className="absolute top-0 right-8">
            <img src="/Hero/Vector (1).png" alt="" />
          </div>
          <div className="absolute bottom-8 left-8">
            <img src="/Hero/Vector (2).png" alt="" />
          </div>
          <div className="absolute bottom-8 right-8">
            <img src="/Hero/Vector (4).png" alt="" />
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url('/Hero/footer 1.png')`,
          backgroundRepeat: "no-repeat",
        }}
        className="overflow-hidden bg-center bg-cover"
      >
        <Footer />
      </div>
      {buyPopup && (
        <div className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen">
          <div className="w-screen h-screen top-0 bottom-0 right-0 left-0 fixed bg-[rgba(49,49,49,0.8)]">
            <div className="flex items-center justify-center h-screen">
              <div
                className={`h-[50vh] md:h-[40vh] ${
                  currentBuyingStatus === buyingStatus.success
                    ? "lg:h-[65vh]"
                    : "lg:h-[40vh]"
                } w-[70vw] lg:w-[25vw] bg-[#111] text-white font-caslon p-5 rounded-md overflow-y-auto drop-shadow-lg`}
              >
                <div className="relative flex items-center justify-end">
                  <button
                    className="text-[#ffffff] absolute bottom-1 top-1 z-10"
                    onClick={() => toggleBuyPopup()}
                  >
                    <RxCross2 size={20} />
                  </button>
                </div>
                  {
                    (showError.show) && (
                    <div className="h-[80%] flex flex-col items-center justify-center mt-10">
                        <h1 className="text-3xl text-red-500">Error !</h1>
                        <p className="my-2 text-xl">{showError.msg}</p>
                    </div>
                    )
                  }
               

                {!showError.show && currentBuyingStatus === buyingStatus.payment && (
                  <div className="h-[80%] flex flex-col items-center justify-center mt-10">
                    <div className="flex items-center w-[90%]">
                      {popUpFirstLoading ? (
                        <div className="relative flex items-center justify-center ">
                          <MoonLoader
                            color={color}
                            loading={popUpFirstLoading}
                            size={26}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            className="mr-2"
                          />
                          <FaLock
                            className="absolute left-2.5 bottom-2.5 opacity-50"
                            size={15}
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <IoMdCheckmarkCircle
                          color="green"
                          size={30}
                          className="mt-0 mr-3"
                        />
                      )}
                      {popUpFirstLoading ? (
                        <div className="w-[80%] h-[40px]  rounded-md relative paymentbutton flex items-center pl-10">
                          <h1 className="absolute z-10">
                            Payment is initiated....
                          </h1>
                        </div>
                      ) : (
                        <div className="w-[80%] h-[40px] bg-green-900 border-none border-slate-400 flex pl-5 items-center rounded-md">
                          <h1 className="absolute z-10">
                            Payment is initiated....
                          </h1>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center w-[90%]">
                      {!popUpFirstLoading && popUpSecondLoading && (
                        <div className="relative flex items-center justify-center mt-3 ">
                          <MoonLoader
                            color={color}
                            loading={popUpSecondLoading}
                            size={26}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            className="mr-2"
                          />
                          <FaLock
                            className="absolute left-2.5 bottom-2.5 opacity-50"
                            size={15}
                            color="#ffffff"
                          />
                        </div>
                      )}
                      {!popUpFirstLoading && !popUpSecondLoading && (
                        <IoMdCheckmarkCircle
                          color="green"
                          size={30}
                          className="mt-2 mr-3"
                        />
                      )}
                      {popUpSecondLoading ? (
                        <div className="w-[80%] h-[40px]  rounded-md relative paymentbutton flex items-center pl-10 mt-3">
                          <h1 className="absolute z-10">
                            Buying in Progress....
                          </h1>
                        </div>
                      ) : (
                        <div
                          className={`w-[80%] h-[40px] border-none border-slate-400 flex items-center mt-3 pl-5 rounded-md
                                       ${
                                         popUpFirstLoading
                                           ? "bg-[rgba(49,49,49,0.8)] text-gray-500 opacity-30 pointer-events-none ml-11"
                                           : "bg-green-900 text-white"
                                       }`}
                        >
                          <h1 className="absolute z-10">
                            Buying in Progress....
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentBuyingStatus === buyingStatus.success &&
                  !popUpSecondLoading && (
                    <div className="flex flex-col items-center justify-center mt-5">
                      <h1 className="mb-4 text-3xl font-semibold">
                        Congratulations !
                      </h1>
                      <img
                        src={cardDetails.cardImageUrl}
                        className="w-[180px] h-[260px] drop-shadow-lg object-contain rounded-lg"
                        style={{ border: "3px solid #2d2d2d" }}
                      />
                      <h1 className="flex items-center my-3 text-base font-extralight">
                        Licence No- 828746888
                        <CopyToClipboard text="828746888">
                          <span className="ml-2 cursor-pointer text-slate-300">
                            <RiFileCopyLine />
                          </span>
                        </CopyToClipboard>
                      </h1>
                      <Link to="/profile">
                        <button className="w-[150px] h-[30px] bg-transparent border-2 border-solid border-[#FCD37B] mt-2">
                          View Details
                        </button>
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
      {sharePopup && (
        <div className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screenn z-20">
        <div className="w-screen h-screen top-0 bottom-0 right-0 left-0 fixed bg-[rgba(49,49,49,0.8)]">
          <div className="flex items-center justify-center h-screen">
            <div
              className="h-[50vh] md:h-[40vh] w-[90vw] lg:w-[30vw] bg-[#111] text-white font-caslon p-5 rounded-md overflow-y-auto drop-shadow-lg "
            >
              <div className="relative flex items-center justify-end">
                <button
                  className="text-[#ffffff] absolute bottom-1 top-1 z-10"
                  onClick={() => updateSharePopup(!sharePopup)}
                >
                  <RxCross2 size={20} />
                </button>
              </div>
              
                  

                <div className="flex items-center flex-wrap">
                {shareOptions.map((option, index) => {
                    const Button = option.button;
                    return (
                      <div key={index} className="h-[60px] w-[80px] flex justify-center items-center">
                        <Button url="https://www.ccbp.in/" className="flex flex-col justify-center items-center">
                          {option.icon}
                          <span className="text-xs">{option.displayText}</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
            
          </div> 
        </div>
    </div>
  </div>
        
      )}
      <ToastContainer />
    </div>
  );
};

export default BuyNft;
