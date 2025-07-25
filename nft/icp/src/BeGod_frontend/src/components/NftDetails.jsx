import React from 'react'
import Navbar from './Landing Page Components/Navbar'
import Footer from './Footer'
import { ArrowBackIcon } from "@chakra-ui/icons"
import { CiShare2 } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa";
import BlueButton from './button/BlueButton';
const NftDetails = () => {
  return (
    <div className='max-w-[1920px] mx-auto'>
      <Navbar />
      <div className='bg-[#2C2C2C4D] h-[320px]'>
        <div className='flex justify-between'>
          <div className='text-white pl-[4%]'>
            <ArrowBackIcon className='text-[45px]' />
          </div>
          <div className='text-white flex gap-12 pr-[5%]'>
            <CiShare2 className='text-[35px]' />
            <HiDotsHorizontal className='text-[35px]' />
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-8 ml-[6%]'>
            <div className="h-[120%] w-[20%]  -mt-8">
              <img src="/freyja.png" alt="" className='h-full w-full object-cover' />
            </div>
            <div className='text-[#FFFFFF] mt-[1%] space-y-4' >
              <h1 className='text-[40px] font-[700] leading-[50px]'>Freyja</h1>
              <h2 className='text-[28px] font-[400] leading-[35px]'>Svallin-Vondr</h2>
              <h1 className='text-[40px] font-[700] leading-[50px]'>10 ICP  <span className='text-[28px] font-[400] leading-[35px]'>20 ICP</span></h1>
              <Link to="" className='flex gap-2 justify-center items-center bg-[#3E3E41]'>
                <div className='h-[25px] w-[25px] '>
                  <img src="/image/col1.png" alt="Norse" className='h-full w-full object-cover' />
                </div>
                <h1>Norse Collection</h1>
              </Link>
            </div>
          </div>
          <div className='flex flex-col gap-[65%]'>
            <div className='text-white '>
              <FaRegStar className='text-[35px] -ml-[120px]' />
            </div>
            <Link to="" className='h-[7%] w-[5vw] flex justify-center items-center bg-[#1E62AC] -ml-[170px] mr-[8] border-[1px] border-white'>
              Buy Now
            </Link>
          </div>
        </div>
      </div>
      {/* About section */}
      <div className='w-[90%] h-auto text-[#FFFFFF] bg-[#1D1D1E] mt-16 ml-[5%]' >
        <h1 className='text-[28px] font-[400] leading-[35px] pl-[3%] pt-[2%]'>About</h1>
        <p className='text-[16px] w-[95%] font-[400] leading-[20px] pl-[3%] pt-[2%] pb-8'>Discover the divine power of Norse mythology with this exclusive NFT card of Freyja, the goddess of love, beauty, and war. Known as Svallin-vondr, or "Shielded-Wand," Freyja is depicted with her iconic Brísingamen necklace and magical staff, embodying both grace and strength. <br />
          Her shield symbolizes protection and unwavering resolve, guiding souls to Valhalla and leading battles with fierce determination. This limited edition NFT card is a must-have for collectors and enthusiasts captivated by the enchanting world of Norse mythology.
        </p>
      </div>
      {/* Details */}
      <div className='w-[90%] ml-[5%] mt-4 flex gap-8' >
        <div className='w-[45%] bg-[#1D1D1E] h-auto text-[#FFFFFF]'>
          <h1 className='text-[28px] font-[400] leading-[35px] pl-[10%] pt-[4%]'>Details</h1>
          <div className='flex flex-col ml-[7%] mt-4'>
            <div className='flex justify-between mr-4'>
              <h1 className='text-[16px]  font-[400] leading-[20px] pl-[3%] pt-[2%]'>Contact Address</h1>
              <h1 className='text-[16px] font-[400] leading-[20px] pl-[3%] pt-[2%]'>0x2358...a68b</h1>
            </div>
            <div className='flex justify-between mr-4'>
              <h1 className='text-[16px]  font-[400] leading-[20px] pl-[3%] pt-[2%]'>Token</h1>
              <h1 className='text-[16px] font-[400] leading-[20px] pl-[3%] pt-[2%]'>ID8050</h1>
            </div>
            <div className='flex justify-between mr-4'>
              <h1 className='text-[16px]  font-[400] leading-[20px] pl-[3%] pt-[2%]'>Token Standard</h1>
              <h1 className='text-[16px] font-[400] leading-[20px] pl-[3%] pt-[2%]'>ERC-721</h1>
            </div>
            <div className='flex justify-between mr-4'>
              <h1 className='text-[16px]  font-[400] leading-[20px] pl-[3%] pt-[2%]'>Chain</h1>
              <h1 className='text-[16px] font-[400] leading-[20px] pl-[3%] pt-[2%]'>ICP</h1>
            </div>
            <div className='flex justify-between mr-4'>
              <h1 className='text-[16px]  font-[400] leading-[20px] pl-[3%] pt-[2%] pb-8'>Last Updated</h1>
              <h1 className='text-[16px] font-[400] leading-[20px] pl-[3%] pt-[2%] pb-8'>7 days ago</h1>
            </div>
          </div>
        </div>
        <div className='w-[55%] bg-[#1D1D1E] h-auto text-[#FFFFFF]' >
          <h1 className='text-[28px] font-[400] leading-[35px] pl-[10%] pt-[4%]'>Traits</h1>
          <div className='flex flex-wrap items-center justify-center gap-8 ml-[5%] mr-[5%] mt-4'>
            <div className='h-[60px] sm:[45%] md:w-[30%] flex justify-center items-center bg-[#414143] text-[#FFFFFF] text-[16px] font-[700] leading-[20px]'>
              Beauty and Grace
            </div>
            <div className='h-[60px] sm:[45%] md:w-[30%] flex justify-center items-center bg-[#414143] text-[#FFFFFF] text-[16px] font-[700] leading-[20px]'>
              Warrior Spirit
            </div>
            <div className='h-[60px] sm:[40%] md:w-[30%] flex justify-center items-center bg-[#414143] text-[#FFFFFF] text-[16px] font-[700] leading-[20px]'>
              Magic and Sorcery
            </div>
            <div className='h-[60px] sm:[40%] md:w-[30%] flex justify-center items-center bg-[#414143] text-[#FFFFFF] text-[16px] font-[700] leading-[20px]'>
              Protective Nature
            </div>
            <div className='h-[60px] sm:[40%] md:w-[30%] flex justify-center items-center bg-[#414143] text-[#FFFFFF] text-[16px] font-[700] leading-[20px]'>
              Protective Nature
            </div>
          </div>
        </div>
      </div>
      <div className='w-[90%] h-auto text-[#FFFFFF] bg-[#1D1D1E] mt-4 ml-[5%]' >
        <div className='flex justify-between w-[95%] pt-[2%]'>
          <h1 className='text-[28px] font-[400] leading-[35px] pl-[3%]'>Norse</h1>
          <BlueButton >View Collection</BlueButton>
        </div>
        <p className='text-[16px] w-[95%] font-[400] leading-[20px] pl-[3%] pt-[2%] pb-8'>Discover the divine power of Norse mythology with this exclusive NFT card of Freyja, the goddess of love, beauty, and war. Known as Svallin-vondr, or "Shielded-Wand," Freyja is depicted with her iconic Brísingamen necklace and magical staff, embodying both grace and strength. <br />
          Her shield symbolizes protection and unwavering resolve, guiding souls to Valhalla and leading battles with fierce determination. This limited edition NFT card is a must-have for collectors and enthusiasts captivated by the enchanting world of Norse mythology.
        </p>
      </div>
      <div className='w-[90%] h-auto text-[#FFFFFF] bg-[#1D1D1E] mt-4 ml-[5%]' >
        <div className='flex justify-between w-[95%] pt-[2%]'>
          <h1 className='text-[28px] font-[400] leading-[35px] pl-[3%]'>Norse</h1>
          <select name="" id="" className='bg-inherit text-[#FFFFFF] '>
            <option value="" className='mr-4'>Date</option>
          </select>
        </div>
        <div className='w-[95%] bg-[#414143] flex mt-4 ml-[3%] text-[#FFFFFF] '>
          <div className='w-[25%] h-[5vh] flex items-center justify-center text-[16px] font-[400] leading-[20px]'>
            MINT #
          </div>
          <div className='w-[25%] flex items-center justify-center text-[16px] font-[400] leading-[20px]'>
            NRI
          </div>
          <div className='w-[25%] flex items-center justify-center text-[16px] font-[400] leading-[20px]'>
            PRICE
          </div>
          <div className='w-[25%] flex items-center justify-center text-[16px] font-[400] leading-[20px]'>
            TIME
          </div>
        </div>
        <div className='w-[95%] bg-[#414143] flex mt-4 ml-[3%] text-[#FFFFFF]'>
          <div className='w-[25%] h-[8vh] flex items-center justify-center text-[16px] font-[700] leading-[20px]'>
            # 2156
          </div>
          <div className='w-[25%] flex items-center justify-center text-[16px] font-[700] leading-[20px]'>
            -
          </div>
          <div className='w-[25%] flex items-center justify-center text-[16px] font-[700] leading-[20px]'>
            $ 5.62
          </div>
          <div className='w-[25%] flex flex-col items-start justify-center text-[16px] font-[700] leading-[20px] pl-[8%]'>
            <h1>3 months ago </h1>
            <h1 className='font-[400]'>Bought</h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default NftDetails
