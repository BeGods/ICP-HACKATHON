import React from 'react'
import Navbar from './Landing Page Components/Navbar'
import YellowButton from './button/YellowButton'
import TopSelling from './Landing Page Components/TopSelling'
import Collections from './Landing Page Components/Collections'
import Footer from './Footer'

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className='sm:flex'>
                <div className='w-screen sm:w-1/2 h-[50vh] ml-[5vw] sm:ml-[8vw] mt-[10vh] sm:mt-[17vh]'>
                    <h1 style={{ fontFamily: 'MyCustomFont' }} className='w-[80%] sm:w-[35vw] text-[30px] sm:text-[40px] font-[500] text-[#FFFFFF]'>
                        Unleash the Divine: Collect and Own NFT Cards of the Gods!
                    </h1>
                    <h2 style={{ fontFamily: "QuickSand" }} className='w-[90vw] sm:w-[40vw] text-[15px] sm:text-[24px] font-[400] text-[#FFFFFF]'>
                        Dive into the Mythical World of Legendary Characters
                    </h2>
                    <button className='w-[50vw] sm:w-[15vw] h-[4vh] bg-[#FCD37B] mt-4'>Explore Collection</button>
                </div>
                <div className='w-[100%] sm:w-1/2 h-[40vh]'>
                    <div className='relative w-full h-[60vh] sm:h-[60vh] sm:w-[25vw] -mt-[60vh] sm:mt-8'>
                        <img src="/image/Group.png" alt="" className='h-full w-full' />
                    </div>
                    <div className='hidden sm:flex absolute w-[15vw] h-[40vh] ml-[5%] -mt-[25%]'>
                        <img src="/image/nft.png" alt="" className=' h-full w-full ' />
                    </div>
                </div>
            </div>
            <TopSelling />
            <Collections />
            <div style={{ fontFamily: "QuickSand" }} className="flex mt-12 relative">
                <div className="h-[500px] w-full sm:w-1/2 flex items-end">
                    <img src="/image/Norse.png" alt="" className="h-full w-full" />
                </div>
                <div className="absolute bg-white bg-opacity-20 sm:bg-inherit w-[80%] sm:w-1/2 right-0 bottom-8 sm:bottom-40 sm:mr-32 p-4 flex flex-col text-white items-end sm:items-start gap-4">
                    <h1 className="text-[20px] sm:text-[30px] font-[400] leading-[40px] text-right">
                        Lorem ipsum
                    </h1>
                    <p className="w-[100%] sm:w-[57%] text-[15px] font-[400] leading-[20px] text-right sm:text-start">
                        Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit
                        pellentesque. Mattis varius urna scelerisque cum mattis vel.
                    </p>
                    <button className="w-[40vw] sm:w-[10vw] h-[4vh] bg-[#000000] flex items-center justify-center border-[1px] border-[#FFFFFF]">
                        Norse Collection
                    </button>
                </div>
            </div>


            <div className='flex flex-col sm:flex-row h-[80vh] sm:h-[48vh] bg-cover bg-center bg-no-repeat ' style={{ backgroundImage: `url("/image/background3.gif")` }}>
                <h1 className='flex sm:hidden text-[30px] sm:text-[35px] font-[700] text-[#FFFFFF] ml-[30%] sm:ml-0'>About Artist</h1>
                <div className='relative w-[80%] sm:w-1/2 flex items-center justify-center ml-[5%] sm:ml-0  sm:mt-0'>
                    <div className='h-[150px] sm:h-[200px]'>
                        <img src="/image/man's_cover.svg" alt="" className='h-full' />
                    </div>
                    <div className='absolute sm:h-[350px]'>
                        <img src="/image/man.png" alt="" className='h-full' />
                    </div>
                </div>
                <div style={{ fontFamily: "QuickSand" }} className='w-full sm:w-1/2 flex flex-col gap-4 justify-center items-center sm:items-start text-[#FFFFFF] mt-4'>
                    <h1 className='hidden sm:flex text-[35px] font-[700]'>About Artist</h1>
                    <h1 className='text-[25px] font-[500]'>Name</h1>
                    <p className='w-[80vw] text-center sm:text-start sm:w-[70%] text-[17px] font-[400]'>
                        Lorem ipsum dolor sit amet consectetur. Aliquam viverra at nam risus auctor quis eu. Nunc mauris erat id suscipit nullam. Nibh imperdiet ac lectus augue sed luctus nibh. Iaculis ullamcorper nulla adipiscing consequat ante.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home
