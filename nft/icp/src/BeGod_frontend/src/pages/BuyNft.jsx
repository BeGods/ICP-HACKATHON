import React, { useState } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import Footer from '../components/Footer'
import YellowButton from '../components/button/YellowButton'
import { CiStar } from "react-icons/ci";
import { CiShare2 } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { RiFileCopyLine } from "react-icons/ri";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { City, Country } from 'country-state-city';
const buyingStatus = {
    payment : "PAYMENT",
    success : "UNLOCK",
    deliveryInfo : "FORM",
    licenceInfo : "Final"
}

const BuyNft = () => {
    const [buyPopup , setbuyPopup] = useState(false);
    const [currentBuyingStatus , setBuyingStatus] = useState(buyingStatus.success);
    const [selectedCountry , updateSelectedCountry] = useState("")
    const [selectedCity , updateSelectedCity] = useState("");

    const countries = Country.getAllCountries().map((eachCountry) => ({
        id : eachCountry.isoCode,
        displayText : eachCountry.name,
    }));

    const [cityList,updateCityList] = useState([]);



    const toggleBuyPopup  = () => {
        setbuyPopup(!buyPopup);
        setBuyingStatus(buyingStatus.success);
    }

    const onChangeCoutry = (event) => {
        console.log(event.target.value);
        const cities = City.getCitiesOfCountry(event.target.value);
        updateCityList(cities);
        updateSelectedCountry(event.target.value)
    }

    const onChangeCity = (event) => {
        if(cityList.length != 0){
            updateSelectedCity(event.target.value)
        }
    }
   
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
                                <YellowButton>Buy <span>Celtic</span> Collection</YellowButton>
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
                    <div className='hidden sm:flex'>
                        <img
                            src="/Hero/up.png"
                            alt="Previous"
                            className={`hover:cursor-pointer -rotate-90`}
                        />
                    </div>
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
                                <h1 className='text-[24px] font-[500] leading-[28px] text-[#FFFFFF]' >Details</h1>
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
                            <div className='ml-[40%]  w-[190px] lg:w-[195px] p-2 border-[1px] border-[#FCD37B]' onClick={()=>setbuyPopup(!buyPopup)}>
                                <YellowButton>Buy <span>Celtic</span> Collection</YellowButton>
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
                    <div className='sm:flex hidden'>
                        <img
                            src="/Hero/down.png"
                            alt="Previous"
                            className={`hover:cursor-pointer -rotate-90`}
                        />
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
                            <div className={`h-[50vh] md:h-[40vh] lg:h-[60vh] ${currentBuyingStatus === buyingStatus.deliveryInfo ? "w-[100vw] md:w-[95vw] lg:w-[50vw]" : "w-[70vw] lg:w-[30vw]"} bg-[#000000] text-white font-caslon  p-5 rounded-md overflow-y-auto`} style={{fontFamily:"Quicksand"}}> 
                                <div className="relative flex justify-end items-center">
                                        <button className="text-[#ffffff] absolute bottom-1 top-1" onClick={() => toggleBuyPopup()}>
                                            <RxCross2 size={25} />
                                        </button>
                                </div>
                                {currentBuyingStatus === buyingStatus.success && (
                                    <div className='h-[90%] relative flex flex-col items-center justify-center mt-10 '>
                                        <h1 className='text-2xl font-semibold'>Congratulations!!!</h1>
                                        <p className='text-sm mb-0'>You Unlocked</p>
                                        <img src='buynftimg.png' className='absolute size-64' />
                                        <h1 className='text-3xl font-bold font-caslon mt-[180px]'>Horse Collection</h1>
                                        <button onClick={()=>setBuyingStatus(buyingStatus.deliveryInfo)} className='mt-3 w-40 border border-white border-solid cursor-pointer bg-[#1E62AC]'>Get A Hard Copy</button>
                                    </div>
                                )}
                                {currentBuyingStatus === buyingStatus.deliveryInfo && (
                                    <div className='md:mt-5'> 
                                        <h1 className='text-2xl font-semibold'>Delivery Info.</h1>
                                        <div className='relative flex items-center my-3'>
                                            <img src="buynftimg2.png" className='absolute w-[150px] h-[160px] -left-10'/>
                                            <div className='ml-[50px]'>
                                                <h1 className='text-lg font-semibold'>Horse Collection</h1>
                                                <p className='text-sm font-extralight'>Hard Copy</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                                <div className='flex flex-col w-[40%] relative'>
                                                    <label className='text-lg font-semibold'>Phone No.<span className='text-red-700 absolute -top-1'>*</span></label>
                                                    <input type='number' className='bg-transparent border-0 border-b border-solid border-white' />
                                                </div>
                                                <div className='flex flex-col w-[40%] relative'>
                                                    <label className='text-lg font-semibold'>Email<span className='text-red-700  absolute -top-2'>*</span></label>
                                                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                                                </div>
                                            </div>
                                            <h1  className='text-lg font-semibold mt-3'>Address</h1>
                                            <div className='flex items-center justify-between mb-3'>
                                                <div className='flex flex-col w-[35%] '>
                                                    <label className='text-sm font-extralight relative'>H No,St No<span className='text-red-700 absolute -top-1'>*</span></label>
                                                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                                                </div>
                                                <div className='flex flex-col w-[35%]'>
                                                    <label className='text-sm font-extralight relative'>City<span className='text-red-700 absolute -top-1'>*</span></label>
                                                    <select className='bg-transparent border-b font-Quicksand' value={selectedCity} onChange={onChangeCity}>
                                                    <option value="" disabled hidden></option> {/* Empty option, hidden */}
                                                        {!selectedCountry ? (
                                                            <option value="" disabled className='bg-black font-Quicksand border-none border-0 text-white'>Select a country first</option>
                                                            ) : (
                                                                cityList.length === 0 ? (
                                                                <option value="" disabled>No cities available</option>
                                                            ) : (
                                                                cityList.map((eachCity) => (
                                                            <option value={eachCity.name} key={eachCity.name} className='bg-black font-Quicksand border-none border-0'>{eachCity.name}</option>
                                                            ))
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                <div className='flex flex-col w-[20%] relative'>
                                                    <label className='text-sm font-extralight'>Country<span className='text-red-700 absolute -top-1'>*</span></label>
                                                    <select className='bg-transparent border-b font-Quicksand' value={selectedCountry} onChange={onChangeCoutry}>
                                                    <option value="" disabled hidden></option> {/* Empty option, hidden */}
            {countries.map((eachCountry) => (
                <option value={eachCountry.id} key={eachCountry.id} className='bg-black font-Quicksand border-none border-0'>{eachCountry.displayText}</option>
            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='flex items-center relative'>
                                            <div className='flex flex-col w-[35%]  mb-3 mr-9 '>
                                                    <label className='text-sm font-extralight'>Pincode<span className='text-red-700 absolute -top-1'>*</span></label>
                                                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                                                </div>
                                                <div className='flex flex-col w-[35%]  mb-3'>
                                                    <label className='text-sm font-extralight'>Nearby LandMark(Optional)</label>
                                                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                                                </div>
                                            </div>
                                            <div className=''>
                                                <p className='text-sm font-extralight'><span className='text-red-700 mr-2'>*</span>Mandatory Information</p>
                                            </div>
                                        <div className='flex justify-center'>
                                        <button onClick={()=>setBuyingStatus(buyingStatus.licenceInfo)} className='mt-3 w-40 border border-white border-solid cursor-pointer bg-[#1E62AC]'>Place Order</button>
                                        </div>
                                    </div>
                                )}
                                {currentBuyingStatus === buyingStatus.licenceInfo && (
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
