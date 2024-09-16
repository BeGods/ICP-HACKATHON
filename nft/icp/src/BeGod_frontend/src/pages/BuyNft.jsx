import React, { useState } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import Footer from '../components/Footer'
import YellowButton from '../components/button/YellowButton'
import { CiStar } from "react-icons/ci";
import { CiShare2 } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { RiFileCopyLine } from "react-icons/ri";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
const buyingStatus = {
    payment : "PAYMENT",
    licenceInfo : "Final"
}

const BuyNft = () => {
    const [buyPopup , setbuyPopup] = useState(false);
    const [currentBuyingStatus , setBuyingStatus] = useState(buyingStatus.payment);


    const toggleBuyPopup  = () => {
        setbuyPopup(!buyPopup);
        setBuyingStatus(buyingStatus.success);
    }



    const { t } = useTranslation(['homepage']);
    const {detailsText,contactAddress,token,tokenStandard,chain,lastUpdated,buyNow} = t('buyNowDetails');
   
    return (
        <div className='font-caslon'>
            <div style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
                <Navbar />
                <div className='max-w-[1920px] mx-auto mt-8 sm:mt-8 w-full flex flex-col  items-center justify-center gap-4'>
                    <img src="/Hero/frame.svg" alt="" className='w-[20%]' />
                    <div className='h-[4px] w-[94%] rounded-lg border'></div>
                </div>
                {/* for mobile screen */}
                <div className='max-w-[1920px] mx-auto mt-8 flex flex-col xl:hidden items-center justify-center overflow-hidden '>
                    <div className=' w-[80%] flex text-white justify-between items-center'>
                        <div className='h-[2vh] w-[10%]'>
                            <CiStar className='h-full w-full object-cover' />
                        </div>
                        <div className='space-y-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]'>
                            <h1 className='text-[50px] sm:text-[64px] font-[400] leading-[54px]' >DOHH</h1>
                            <h2 className='text-[16px] font-[400] leading-[14px] text-center'>GAE DEARG</h2>
                        </div>
                        <CiShare2 />
                    </div>
                    <div className=' flex items-center mt-16'>
                        <div>
                            <img
                                src="/Hero/up.png"
                                alt="Previous"
                                className={`hover:cursor-pointer -rotate-90`}
                            />
                        </div>
                        <div>
                            <div
                                className="h-full w-full shadow-lg rounded-lg"
                                style={{ boxShadow: '0px 0px 94px 36px #06B225' }}
                            >
                                <img
                                    src="/Hero/celtic-green.png"
                                    alt=""
                                    className="shadow-lg w-full h-full object-cover rounded-lg"
                                    style={{ boxShadow: '0px 0px 20.8px 5px #000000' }}

                                />
                            </div>
                            <div className='mt-8 mx-8 w-[195px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]' onClick={()=>setbuyPopup(!buyPopup)}>
                                <YellowButton>{t('buyNow')}</YellowButton>
                            </div>
                        </div>
                        <div>
                            <img
                                src="/Hero/down.png"
                                alt="Previous"
                                className={`hover:cursor-pointer -rotate-90`}
                            />
                        </div>
                    </div>
                    <h1 className=' w-[90%] mt-8 text-center text-[24px] font-[500] leading-[28px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]'s>Lorem ipsum dolor sit amet consectetur. Aliquam tortor rhoncus tristique facilisi imperdiet interdum elementum. Lectus posuere tempor sed purus enim tristique nulla. Adipiscing proin ut et pellentesque dui bibendum ut sapien. Laoreet risus feugiat sed viverra dolor cum lacinia duis volutpat.</h1>
                    <div className='mt-8 h-[4px] w-[80%] rounded-lg border'></div>
                    <div className='mt-8 w-[80%] flex flex-col space-y-2'>
                        <h1 className='text-[24px] font-[500] leading-[28px] text-[#FFFFFF]'>Details</h1>
                        <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                            <h1>Contact Address</h1>
                            <h1>0x2358...a68b</h1>
                        </div>
                        <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                            <h1>Token</h1>
                            <h1>ID8050</h1>
                        </div>
                        <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                            <h1>Token Standard</h1>
                            <h1>ERC-721</h1>
                        </div>
                        <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                            <h1>Chain</h1>
                            <h1>ICP</h1>
                        </div>
                        <div className='flex items-center justify-between text-[16px] font-[500] leading-[20px] text-[#FFFFFF]'>
                            <h1>Last updated</h1>
                            <h1>7 Days ago</h1>
                        </div>
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
                                <div className='space-y-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]'>
                                    <h1 className='text-[64px] font-[400] leading-[54px]' >DOHH</h1>
                                    <h2 className='text-[16px] font-[400] leading-[14px] text-center' >GAE DEARG</h2>
                                </div>
                                <CiShare2 />
                            </div>
                            <h1 className='ml-[10%] w-[80%] text-center text-[24px] font-[500] leading-[28px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0]' >Lorem ipsum dolor sit amet consectetur. Aliquam tortor rhoncus tristique facilisi imperdiet interdum elementum. Lectus posuere tempor sed purus enim tristique nulla. Adipiscing proin ut et pellentesque dui bibendum ut sapien. Laoreet risus feugiat sed viverra dolor cum lacinia duis volutpat.</h1>
                            <div className='ml-[10%] w-[80%] flex flex-col space-y-2'>
                                <h1 className='text-[24px] font-[500] leading-[28px] text-[#FFFFFF]' >{detailsText}</h1>
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
                            </div>
                            <div className='ml-[40%]  w-[190px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]' onClick={()=>setbuyPopup(!buyPopup)}>
                                <YellowButton>{buyNow}</YellowButton>
                            </div>
                        </div>
                        <div>
                            <div
                                className="h-[60%] w-[80%] mt-[40%] ml-[50%] shadow-lg rounded-lg"
                                style={{ boxShadow: '0px 0px 94px 36px #06B225' }}
                            >
                                <img
                                    src="/Hero/celtic-green.png"
                                    alt=""
                                    className="shadow-lg w-full h-full object-cover rounded-lg"
                                    style={{ boxShadow: '0px 0px 20.8px 5px #000000' }}

                                />
                            </div>
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
                        <h1 className='sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border'>Celtic</h1>
                        <h2 className='text-center sm:text-start w-[90%] lg:w-[70%]'>Lorem ipsum dolor sit amet consectetur. Aliquam tortor rhoncus tristique facilisi imperdiet interdum elementum. Lectus posuere tempor sed purus enim tristique nulla. Adipiscing proin ut et pellentesque dui bibendum ut sapien. Laoreet risus feugiat sed viverra dolor cum lacinia duis volutpat.</h2>
                        <div className='sm:ml-0 w-[193px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]'>
                            <YellowButton>Buy <span>Celtic</span> Collection</YellowButton>
                        </div>
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
                            <div className={`h-[50vh] md:h-[40vh] lg:h-[60vh] w-[70vw] lg:w-[30vw] bg-[#000000] text-white font-caslon  p-5 rounded-md overflow-y-auto`} style={{fontFamily:"Quicksand"}}> 
                                <div className="relative flex justify-end items-center">
                                        <button className="text-[#ffffff] absolute bottom-1 top-1" onClick={() => toggleBuyPopup()}>
                                            <RxCross2 size={25} />
                                        </button>
                                </div>
                                {currentBuyingStatus === buyingStatus.payment && (
                                    <div className='h-[90%] relative flex flex-col items-center justify-center mt-10 '>
                                        <h1 className='text-white'>Payment</h1>
                                        <button onClick={()=>setBuyingStatus(buyingStatus.success)} className='mt-3 w-40 border border-white border-solid cursor-pointer bg-[#1E62AC]'>success</button>
                                    </div>
                                )}
                                
                                
                                {currentBuyingStatus === buyingStatus.success && (
                                    <div className='flex flex-col items-center mt-5 '>
                                        <h1 className='text-2xl font-semibold mb-2'>Congratulations</h1>
                                        <img src='buynftimg3.png' className='w-[180px] h-[260px]' />
                                        <h1 className='flex items-center text-base font-extralight mt-2'>
                                            
                                                Licence No- 828746888
                                            <CopyToClipboard text='828746888'> 
                                                <span className='ml-2 text-slate-300 cursor-pointer'><RiFileCopyLine /></span>
                                            </CopyToClipboard>
                                            
                                        </h1>
                                        <button className='w-[150px] h-[26px] bg-transparent border-2 border-solid border-[#FCD37B] mt-2'>View Details</button>
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
