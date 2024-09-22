import React, { useEffect, useState ,CSSProperties } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import Footer from '../components/Footer'
import YellowButtonUserSide from '../components/button/YellowButtonUserSide'
import { CiStar } from "react-icons/ci";
import { CiShare2 } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { RiFileCopyLine } from "react-icons/ri";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../utils/useAuthClient.jsx";
import { Principal } from '@dfinity/principal';
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton';
import MoonLoader from "react-spinners/MoonLoader";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FiLock } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import './index.css'



const buyingStatus = {
    payment : "PAYMENT",
    success : "SUCCESS"
}

const BuyNft = () => {
    const [buyPopup , setbuyPopup] = useState(false);
    const [currentBuyingStatus , setBuyingStatus] = useState(buyingStatus.payment);
    const [cardDetails,setCardDetails] = useState({});

    const [nftCardLoading,setNftCardLoading] = useState(true);

    const [collectionDetails,setCollectionDetails] = useState({});
    const [collectionDetailsLoading,setCollectionDetailsLoading]  = useState(true);

    const [tokenId,setTokenId] = useState("");


    

    let [popUpFirstLoading, setLoadingFirst] = useState(true);
    let [popUpSecondLoading,setLoadingSecond] = useState(false);
    let [color, setColor] = useState("#ffffff");

    const toggleBuyPopup  = () => {
        setbuyPopup(!buyPopup);
        setBuyingStatus(buyingStatus.payment);
    }
    
    const onClickBuyButton = async() => {
        setbuyPopup(true);
        setBuyingStatus(buyingStatus.payment);

        setLoadingFirst(true);  // Start loading

        //* this part is only to test the payment popup . comment this if you want to test the actual buying process  */

        // const timer = setTimeout(() => {
        //     setLoadingFirst(false); 
        //     setLoadingSecond(true); 
        // }, 3000);  

        // const timer2 = setTimeout(() => {
        //     setLoadingSecond(false);  
        //     setBuyingStatus(buyingStatus.success);  // comment this line to stay in the payment part only
        // }, 6000);  


        //** uncomment the entire below part to make the actual buying process  **//


        const result1 = await backendActor?.purchaseNft(Principal.fromText(collectionId),tokenId,parseInt(cardDetails.cardPrice),"4vjzx-uecpg-txgb6-n5dpd-blies-iofpf-q27ye-lqa6i-b5mth-dyind-eqe");
        
        setLoadingFirst(false);
        setLoadingSecond(true);
        console.log("payment address",result1);
        console.log("payment address",result1.ok[0]);
        const paymentAddress = result1.ok[0];

        const result = await backendActor?.send_balance_and_nft(Principal.fromText(collectionId),paymentAddress,parseInt(cardDetails.cardPrice),[]);
        console.log("final result",result);
        setLoadingSecond(false);

        console.log(result.ok);
        console.log("result type",typeof(result.ok));

        // if(result.ok == parseInt(2n)){
        //     setBuyingStatus(buyingStatus.success)
        // }

        setBuyingStatus(buyingStatus.success);

    }

    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const collectionId = params.get('collectionId');
    const index = params.get('index');

   
   // console.log("collectionId",collectionId);
   // console.log("card index",index);


    const { t } = useTranslation();
    const {detailsText,contactAddress,token,tokenStandard,chain,lastUpdated,buyNow} = t('buyNowDetails');

    const { backendActor } = useAuth({});
    
    useEffect(()=>{
        window.scrollTo(0, 0);
    })
   

    const fetchCardDetails=async()=>{

        const result= await backendActor?.getSingleNonFungibleTokens(Principal.fromText(collectionId),parseInt(index));
       //  console.log("buying nft details" , result);
        // console.log("buying nft details 0 1" , result[0][1]);
       // console.log("buying nft details 0 2" , result[0][2].nonfungible.metadata[0]);
        // console.log("buying nft details 2" , result[2]);
        const cardDetails = result[0][2].nonfungible;

        const metadata = JSON.parse(cardDetails.metadata[0].json)

        

        const updatedCardDetails = {
            cardName : metadata[0].name,
            cardType : metadata[1].type,
            cardImageUrl : cardDetails.thumbnail,
            cardDescription : cardDetails.description,
            cardPrice : parseInt(100000000),
        }

        setCardDetails(updatedCardDetails);
        setNftCardLoading(false);

    }

    useEffect(()=>{
        fetchCardDetails();
    },[])

    const fetchTokenId = async() => {
        const tokenId = await backendActor?.getNftTokenId(Principal.fromText(collectionId),parseInt(index));

        setTokenId(tokenId)

    }
    useEffect(()=>{
        fetchTokenId()
    },[])

    const fetchCollectionDetails=async()=>{
        const result = await backendActor?.getAllCollections();
        const collectionItems = result[0][1];
        collectionItems.map((eachItem)=>{

            // console.log("each item collection id",eachItem[1]);
            // console.log("");
            // console.log("collection Id" , Principal.fromText(collectionId))
           
                if(collectionId === eachItem[1].toString()){
                    // console.log("inside")
                    setCollectionDetails({
                        collectionId : collectionId,
                        collectionName : eachItem[2],
                        collectionDescription : eachItem[4]
                    })
                    setCollectionDetailsLoading(false);
                    return;
                }
    });
}

    
    useEffect(()=>{
        fetchCollectionDetails();
    },[])


 //   console.log("before return ",collectionDetails)
   
    return (
        <div className={`font-caslon ${buyPopup && "fixed"}`}>
            <div style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
                <Navbar />
                <div className='max-w-[1920px] mx-auto mt-8 sm:mt-8 w-full flex flex-col  items-center justify-center gap-4'>
                    <img src="/Hero/frame.svg" alt="" className='w-[20%]' />
                    <div className='h-[4px] w-[94%] rounded-lg border'></div>
                </div>
                
                {/* for mobile screen */}
                <div className='max-w-[1920px] mx-auto mt-8 flex flex-col xl:hidden items-center justify-center overflow-hidden '>
                    <div className='w-[80%] flex text-white justify-between items-center'>
                        <div className='h-[2vh] w-[10%]'>
                            <CiStar className='h-full w-full object-cover' />
                        </div>
                        {nftCardLoading ? (
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <div className='flex flex-col justify-center items-center'>
                                    <Skeleton count={1} width={100} height={50} />
                                    <Skeleton count={1} width={70} height={20} />
                                </div>
                            </SkeletonTheme>
                        ) : (
                            <div className='space-y-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]'>
                                <h1 className='text-[50px] sm:text-[64px] font-[400] leading-[54px]'>
                                    {cardDetails ? cardDetails.cardName : <Skeleton />}
                                </h1>
                                <h2 className='text-[16px] font-[400] leading-[14px] text-center'>
                                    {cardDetails ? cardDetails.cardType : <Skeleton />}
                                </h2>
                            </div>
                        )}
                        <CiShare2 />
                    </div>
                    <div className='flex items-center mt-16'>
                        <div>
                            <div
                                className="h-full w-full shadow-lg rounded-lg"
                                style={{ boxShadow: '0px 0px 94px 36px #06B225' }}
                            >
                                {nftCardLoading ? (
                                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                        <div className='h-full w-full'>
                                            <Skeleton height={320} width={280} />
                                        </div>
                                    </SkeletonTheme>
                                ) : (
                                    <img
                                        src={cardDetails?.cardImageUrl}
                                        alt=""
                                        className="shadow-lg w-full h-full object-cover rounded-lg"
                                        style={{ boxShadow: '0px 0px 20.8px 5px #000000' }}
                                    />
                                )}
                            </div>
                            {/* <div className='mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]' onClick={() => setbuyPopup(!buyPopup)}>
                                <YellowButtonUserSide>{t('buyNow')}</YellowButtonUserSide>
                            </div> */}
                            {nftCardLoading ? (
                               <div className='mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#202020]'>
                                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            <Skeleton count={1} width={178} height={40}/>
                                      </SkeletonTheme>
                               </div>
                         ):(
                            <div className='mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]'>
                            <button 
                                className="w-full bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                                disabled={nftCardLoading}
                                onClick={onClickBuyButton}
                            >
                                    Buy for {cardDetails.cardPrice/100000000} ICP
                                </button>

                            </div>
                         )}
                        </div>
                    </div>
                    <h1 className='w-[90%] mt-8 text-center text-[24px] font-[500] leading-[28px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]'>
                        {nftCardLoading ? (
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <Skeleton count={3} width="100%" height={20} />
                            </SkeletonTheme>
                        ) : (
                            cardDetails.cardDescription
                        )}
                    </h1>
                    <div className='mt-8 h-[4px] w-[80%] rounded-lg border'></div>
                    <div className='mt-8 w-[80%] flex flex-col space-y-2'>
                        <h1 className='text-[24px] font-[500] leading-[28px] text-[#FFFFFF]'>Details</h1>
                        {nftCardLoading ? (
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <Skeleton count={5} height={20} />
                            </SkeletonTheme>
                        ) : (
                            <>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                    <h1>{contactAddress}</h1>
                                    <h1>0x2358...a68b</h1>
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                    <h1>{token}</h1>
                                    <h1>ID8050</h1>
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                    <h1>{tokenStandard}</h1>
                                    <h1>ERC-721</h1>
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                    <h1>{chain}</h1>
                                    <h1>ICP</h1>
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                    <h1>{lastUpdated}</h1>
                                    <h1>7 Days ago</h1>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='mt-8 h-[4px] w-[80%] rounded-lg border'></div>
                </div>

                {/* For desktop screen */}
                <div className='max-w-[1920px] mx-auto hidden xl:flex xl:w-[100%] 2xl:w-[93%]  items-center justify-center overflow-hidden' style={{ backgroundImage: `url('/Hero/green BG.svg')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
                    
                    <div className='hidden w-full sm:flex' >
                        <div className='mt-8 w-[50%] flex flex-col space-y-8 ml-[10%]' >
                            <div className=' w-full flex text-white justify-between'>
                                <div className='h-[2vh] w-[10%]'>
                                    <CiStar className='h-full w-full object-cover' />
                                </div>
                               
                                    {nftCardLoading ? (
                                         <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                        <div className='flex flex-col justify-center items-center'>
                                            <Skeleton count={1} width={100} height={50}/>
                                            <Skeleton count={1} width={70} height={20}/>
                                        </div>
                                         </SkeletonTheme>
                                    ):(
                                        <div className='space-y-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]'>
                                            <h1 className='text-[64px] font-[400] leading-[54px]' >{cardDetails.cardName } </h1>
                                            <h2 className='text-[16px] font-[400] leading-[14px] text-center' >{cardDetails.cardType}</h2>
                                        </div>
                                    )}
                              
                                <CiShare2 />
                            </div>
                            {nftCardLoading ? (
                                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                        <div className='flex flex-col justify-center items-center'>
                                            <Skeleton count={4} width={600} height={20}/>
                                        </div>
                                    </SkeletonTheme>
                                ):(
                                       <h1 className='ml-[10%] w-[80%] text-center text-[24px] font-[500] leading-[28px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]' >{cardDetails?.cardDescription}</h1>
                            )}
                            
                            <div className='ml-[10%] w-[80%] flex flex-col space-y-2'>
                                <h1 className='text-[24px] font-[500] leading-[28px] text-[#FFFFFF]' >{detailsText}</h1>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                    {nftCardLoading ? (
                                         <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            
                                                <Skeleton count={1} width={140} height={20}/>
                                                <Skeleton count={1} width={140} height={20}/>
                                          </SkeletonTheme>
                                    ):(
                                        <>
                                        <h1>{contactAddress}</h1>
                                        <h1>0x2358...a68b</h1>
                                        </>
                                    )}
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                {nftCardLoading ? (
                                         <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            
                                                <Skeleton count={1} width={140} height={20}/>
                                                <Skeleton count={1} width={140} height={20}/>
                                          </SkeletonTheme>
                                    ):(
                                        <>
                                        <h1>{token}</h1>
                                        <h1>ID8050</h1>
                                        </>
                                    )}
                                    
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                {nftCardLoading ? (
                                         <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            
                                                <Skeleton count={1} width={140} height={20}/>
                                                <Skeleton count={1} width={140} height={20}/>
                                          </SkeletonTheme>
                                    ):(
                                        <>
                                        <h1>{tokenStandard}</h1>
                                    <h1>ERC-721</h1>
                                        </>
                                    )}
                                    
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                {nftCardLoading ? (
                                         <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            
                                                <Skeleton count={1} width={140} height={20}/>
                                                <Skeleton count={1} width={140} height={20}/>
                                          </SkeletonTheme>
                                    ):(
                                        <>
                                        <h1>{chain}</h1>
                                        <h1>ICP</h1>
                                        </>
                                    )}
                                    
                                </div>
                                <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                                {nftCardLoading ? (
                                         <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            
                                                <Skeleton count={1} width={140} height={20}/>
                                                <Skeleton count={1} width={140} height={20}/>
                                          </SkeletonTheme>
                                    ):(
                                        <>
                                        <h1>{lastUpdated}</h1>
                                        <h1>7 Days ago</h1>
                                        </>
                                    )}
                                    
                                </div>
                            </div>
                         {nftCardLoading ? (
                               <div className='ml-[40%]  w-[190px] lg:w-[195px] p-2 border-[1px] border-[#202020]'>
                                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                            <Skeleton count={1} width={178} height={40}/>
                                      </SkeletonTheme>
                               </div>
                         ):(
                            <div className='ml-[40%]  w-[190px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]'>
                            <button 
                                className="w-full bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                                disabled={nftCardLoading}
                                onClick={onClickBuyButton}
                            >
                                    Buy for {cardDetails.cardPrice/100000000} ICP
                                </button>

                            </div>
                         )}
                        </div>
                        <div>
                            
                                {nftCardLoading ? (
                                    <div
                                    className="h-[60%] w-[80%] mt-[40%] ml-[50%] shadow-lg rounded-lg"
                                >

                                        <SkeletonTheme baseColor="#202020" highlightColor="#444">                                       
                                            <Skeleton count={1} height={320} width={250}   className='border-none shadow-lg  object-cover rounded-lg'/>
                                        </SkeletonTheme>
                                    </div>
                                    
                                ):(
                                    <div
                                className="h-[60%] w-[80%] mt-[40%] ml-[50%] shadow-lg rounded-lg"
                                style={{ boxShadow: '0px 0px 94px 36px #06B225' }}
                            >
                                      <img
                                    src={cardDetails?.cardImageUrl}
                                    alt=""
                                    className="shadow-lg w-full h-full object-cover rounded-lg"
                                    style={{ boxShadow: '0px 0px 20.8px 5px #000000' }}

                                />
                                </div>
                                )}
                              
                            </div>
                        
                    </div>
                </div>
                <div className='relative max-w-[1920px] mx-auto mt-8 pb-8 w-[100%] flex flex-col md:flex-row items-center justify-center'>
                    <div className='flex items-center justify-center xl:hidden  w-[100%] xl:w-[130%] lg:pl-[3%]'>
                        <img src="/Hero/celtic_hero.png" alt="" />
                    </div>
                    <div className='hidden xl:flex w-[100%] xl:w-[130%] lg:pl-[3%]'>
                        <img src="/Hero/Mask group.png" alt="" />
                    </div>
                    
                    <div className='flex flex-col items-center justify-center md:items-start w-[100%] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] space-y-4'>
                         {collectionDetailsLoading ? (
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <Skeleton count={1} height={80} width={150}  />
                                <Skeleton count={4} width={600} height={20}/>
                            </SkeletonTheme>
                         ):(
                            <>
                            <h1 className='sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border'>{collectionDetails?.collectionName}</h1>
                            <h2 className='text-center sm:text-start w-[90%] lg:w-[70%]'>{collectionDetails?.collectionDescription}</h2>
                            </>
                         )}
                        
                    </div>
                    <div className='absolute top-0 left-8'>
                        <img src="/Hero/Vector.png" alt="" />
                    </div>
                    <div className='absolute top-0 right-8'>
                        <img src="/Hero/Vector (1).png" alt="" />
                    </div>
                    <div className='absolute bottom-8 left-8'>
                        <img src="/Hero/Vector (2).png" alt="" />
                    </div>
                    <div className='absolute bottom-8 right-8'>
                        <img src="/Hero/Vector (4).png" alt="" />
                    </div>
                </div>
            </div>

            <div style={{ backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='overflow-hidden bg-center bg-cover'>
                <Footer />
            </div>
            {buyPopup && (
                <div className='w-screen h-screen top-0 bottom-0 right-0 left-0 fixed'>
                    <div className='w-screen h-screen top-0 bottom-0 right-0 left-0 fixed bg-[rgba(49,49,49,0.8)] '>
                        <div className='h-screen flex justify-center items-center'>
                            <div className={`h-[50vh] md:h-[40vh]  ${currentBuyingStatus === buyingStatus.success ? "lg:h-[60vh]":"lg:h-[40vh]"} w-[70vw] lg:w-[25vw] bg-[#000000] text-white font-caslon  p-5 rounded-md overflow-y-auto`} style={{fontFamily:"Quicksand"}}> 
                                <div className="relative flex justify-end items-center">
                                        <button className="text-[#ffffff] absolute bottom-1 top-1" onClick={() => toggleBuyPopup()}>
                                            <RxCross2 size={20} />
                                        </button>
                                </div>
                                {currentBuyingStatus === buyingStatus.payment && (
                            // Type - 1 
                            //     <div className='h-[85%] flex flex-col items-center justify-center mt-10'>
                            //         <div className='w-[80%] h-[40px] bg-purple-900 border border-slate-400 flex pl-5 items-center rounded-md'>
                            //             {popUpFirstLoading ? (
                            //                 <MoonLoader  
                            //                     color={color}
                            //                     loading={popUpFirstLoading}
                            //                     size={15}
                            //                     aria-label="Loading Spinner"
                            //                     data-testid="loader"
                            //                     className='mr-2'
                            //                 />
                            //             ) : (
                            //                 <IoMdCheckmarkCircle color='green' size={25} className='mr-2'/>
                            //             )}
                            //             <h1 className=''>Payment is initiated....</h1>
                            //         </div>

                            //         <div 
                            //             className={`w-[80%] h-[40px] border border-slate-400 flex items-center mt-3 pl-5 rounded-md
                            //                         ${popUpFirstLoading ? 'bg-[rgba(49,49,49,0.8)] text-gray-500 opacity-20 pointer-events-none' : 'bg-purple-900 text-white'}`}
                            //         >
                            //             {!popUpFirstLoading && popUpSecondLoading && (
                            //                 <MoonLoader  
                            //                     color={color}
                            //                     loading={popUpSecondLoading}
                            //                     size={15}
                            //                     aria-label="Loading Spinner"
                            //                     data-testid="loader"
                            //                     className='mr-2'
                            //                 />
                            //             )}
                            //             {!popUpFirstLoading && !popUpSecondLoading && (
                            //                 <IoMdCheckmarkCircle color='green' size={25} className='mr-2'/>
                            //             )}
                            //             <h1 className={`${!popUpSecondLoading ? "pl-7" : "pl-1"}`}>Buying in Progress....</h1>
                            //         </div>
                            // </div>

                            //Type -2  
                                // <div className='h-[80%] flex flex-col items-center justify-center mt-10'>
                                //     <div className='w-[80%] h-[40px] bg-purple-900 border-none border-slate-400 flex pl-5 items-center rounded-md'>
                                //         {popUpFirstLoading ? (
                                //             <div className='relative flex items-center justify-center'>
                                //                 <MoonLoader  
                                //                 color={color}
                                //                 loading={popUpFirstLoading}
                                //                 size={25}
                                //                 aria-label="Loading Spinner"
                                //                 data-testid="loader"
                                //                 className='mr-2'
                                //             />
                                //             <FaLock className='absolute left-2 opacity-50' size={15} color='#ffffff'/>
                                //             </div>
                                            

                                //         ) : (
                                //             <IoMdCheckmarkCircle color='#000000' size={30} className='mr-2'/>
                                //         )}
                                //         <h1 className=''>Payment is initiated....</h1>
                                //     </div>

                                //     <div 
                                //         className={`w-[80%] h-[40px] border-none border-slate-400 flex items-center mt-3 pl-5 rounded-md
                                //                     ${popUpFirstLoading ? 'bg-[rgba(49,49,49,0.8)] text-gray-500 opacity-20 pointer-events-none' : 'bg-purple-900 text-white'}`}
                                //     >
                                //         {!popUpFirstLoading && popUpSecondLoading && (
                                //            <div className='relative flex items-center justify-center'>
                                //            <MoonLoader  
                                //            color={color}
                                //            loading={popUpSecondLoading}
                                //            size={25}
                                //            aria-label="Loading Spinner"
                                //            data-testid="loader"
                                //            className='mr-2'
                                //        />
                                //        <FaLock className='absolute left-2 opacity-50' size={15} color='#ffffff'/>
                                //        </div>
                                //         )}
                                //         {!popUpFirstLoading && !popUpSecondLoading && (
                                //             <IoMdCheckmarkCircle color='#000000' size={30} className='mr-2'/>
                                //         )}
                                //         <h1 className={`${!popUpSecondLoading && popUpFirstLoading ? "pl-10" : "pl-0"}`}>Buying in Progress....</h1>
                                //     </div>
                                // </div>                                  
                            //Type -3                          
                            //     <div className='h-[80%] flex flex-col items-center justify-center mt-10'>
                            //      <div className='flex items-center w-[90%]'>
                            //         {popUpFirstLoading ? (
                            //             <div className='relative flex items-center justify-center '>
                            //                 <MoonLoader  
                            //                 color={color}
                            //                 loading={popUpFirstLoading}
                            //                 size={26}
                            //                 aria-label="Loading Spinner"
                            //                 data-testid="loader"
                            //                 className='mr-2'
                            //             />
                            //             <FaLock className='absolute left-2.5 bottom-2.5 opacity-50' size={15} color='#ffffff'/>
                            //             </div>
                                        

                            //         ) : (
                            //             <IoMdCheckmarkCircle color='#ffffff' size={30} className='mr-2 mt-0'/>
                            //         )}
                            //         <div className='w-[80%] h-[40px] bg-purple-900 border-none border-slate-400 flex pl-5 items-center rounded-md'>
                            //             <h1 className=''>Payment is initiated....</h1>
                            //         </div>
                            //     </div>
                            //     <div className='flex items-center w-[90%]'>
                            //         {!popUpFirstLoading && popUpSecondLoading && (
                            //            <div className='relative flex items-center justify-center'>
                            //                 <MoonLoader  
                            //                     color={color}
                            //                     loading={popUpSecondLoading}
                            //                     size={26}
                            //                     aria-label="Loading Spinner"
                            //                     data-testid="loader"
                            //                     className='mr-2'
                            //                 />
                            //                 <FaLock className='absolute left-2.5 bottom-2.5 opacity-50' size={15} color='#ffffff'/>
                            //             </div>
                            //         )}
                            //         {!popUpFirstLoading && !popUpSecondLoading && (
                            //             <IoMdCheckmarkCircle color="green" size={30} className='mr-2 mt-2'/>
                            //         )}
                            //         <div 
                            //             className={`w-[80%] h-[40px] border-none border-slate-400 flex items-center mt-3 pl-5 rounded-md
                            //                         ${popUpFirstLoading ? 'bg-[rgba(49,49,49,0.8)] text-gray-500 opacity-20 pointer-events-none ml-11' : 'bg-purple-900 text-white'}`}
                            //         >
                            //             <h1 className={``}>Buying in Progress....</h1>
                            //         </div>
                            //     </div>    
                            // </div>      
                            
                           // Type - 4 
                            <div className='h-[80%] flex flex-col items-center justify-center mt-10'>
                            <div className='flex items-center w-[90%]'>
                               {popUpFirstLoading ? (
                                   <div className='relative flex items-center justify-center '>
                                       <MoonLoader  
                                       color={color}
                                       loading={popUpFirstLoading}
                                       size={26}
                                       aria-label="Loading Spinner"
                                       data-testid="loader"
                                       className='mr-2'
                                   />
                                   <FaLock className='absolute left-2.5 bottom-2.5 opacity-50' size={15} color='#ffffff'/>
                                   </div>
                                   

                               ) : (
                                   <IoMdCheckmarkCircle color='purple' size={30} className='mr-3 mt-0'/>
                               )}
                               {
                                popUpFirstLoading ? (
                                   <div className='w-[80%] h-[40px]  rounded-md relative paymentbutton flex items-center pl-10'>
                                   <h1 className='absolute z-10'>Payment is initiated....</h1>
                               </div>
                                ):(
                                    <div className='w-[80%] h-[40px] bg-purple-900 border-none border-slate-400 flex pl-5 items-center rounded-md'>
                                   <h1 className='absolute z-10'>Payment is initiated....</h1>
                               </div>
                               )
                                }
                            </div>
                           <div className='flex items-center w-[90%]'>
                                {!popUpFirstLoading && popUpSecondLoading && (
                                   <div className='relative flex items-center justify-center mt-3 '>
                                        <MoonLoader  
                                            color={color}
                                            loading={popUpSecondLoading}
                                            size={26}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        className='mr-2'
                                        />
                                        <FaLock className='absolute left-2.5 bottom-2.5 opacity-50' size={15} color='#ffffff'/>
                                    </div>
                                )}
                            {!popUpFirstLoading && !popUpSecondLoading && (
                                  <IoMdCheckmarkCircle color="purple" size={30} className='mr-3 mt-2'/>
                                )}
                               {/* <div 
                                    className={`w-[80%] h-[40px] border-none border-slate-400 flex items-center mt-3 pl-5 rounded-md
                                                ${popUpFirstLoading ? 'bg-[rgba(49,49,49,0.8)] text-gray-500 opacity-20 pointer-events-none ml-11' : 'bg-purple-900 text-white'}`}
                                >
                                    <h1 className={``}>Buying in Progress....</h1>
                                </div> */}
                                {
                                 popUpSecondLoading ? (
                                     <div className='w-[80%] h-[40px]  rounded-md relative paymentbutton flex items-center pl-10 mt-3'>
                                    <h1 className='absolute z-10'>Buying in Progress....</h1>
                                </div>
                                 ):(
                                     <div  className={`w-[80%] h-[40px] border-none border-slate-400 flex items-center mt-3 pl-5 rounded-md
                                       ${popUpFirstLoading ? 'bg-[rgba(49,49,49,0.8)] text-gray-500 opacity-30 pointer-events-none ml-11' : 'bg-purple-900 text-white'}`}>
                                   <h1 className='absolute z-10'>Buying in Progress....</h1>
                                </div>
                                 )
                                }
                            </div>    
                            </div>       
                            )}



                                
                                {currentBuyingStatus === buyingStatus.success && !popUpSecondLoading && (
                                    <div className='flex flex-col items-center justify-center mt-5 '>
                                        <h1 className='text-2xl font-semibold mb-2'>Congratulations</h1>
                                        <img src={cardDetails.cardImageUrl} className='w-[180px] h-[260px]' />
                                        <h1 className='flex items-center text-base font-extralight mt-2'>
                                            
                                                Licence No- 828746888
                                            <CopyToClipboard text='828746888'> 
                                                <span className='ml-2 text-slate-300 cursor-pointer'><RiFileCopyLine /></span>
                                            </CopyToClipboard>
                                            
                                        </h1>
                                        <Link to="/profile">
                                            <button className='w-[150px] h-[26px] bg-transparent border-2 border-solid border-[#FCD37B] mt-2'>View Details</button>
                                        </Link>
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}

export default BuyNft
