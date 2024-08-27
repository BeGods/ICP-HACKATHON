import React from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import YellowButton from '../components/button/YellowButton'
import TopSelling from '../components/Landing Page Components/TopSelling'
import Collections from '../components/Landing Page Components/Collections'
import Footer from '../components/Footer'
import Circle from '../components/Landing Page Components/Circle'
import CollectionTypes from '../components/Landing Page Components/CollectionTypes'
import { useTranslation } from 'react-i18next'

const Home = () => {
    const { t } = useTranslation();
    const { heading, description, button } = t("home")
    // const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect';
    // const data = new FormData();
    // data.append('q', 'English is hard, but detectably so');

    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'x-rapidapi-key': 'a9b9a5ad21msh094f2dc7648ab52p1f0271jsne4f74809ce94',
    //         'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
    //         'Accept-Encoding': 'application/gzip'
    //     },
    //     body: data
    // };

    // const translate = async () => {
    //     try {
    //         const response = await fetch(url, options);
    //         const result = await response.text();
    //         console.log(result);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // translate();
    return (
        <div className="max-w-[1920px] mx-auto md:w-[130vw] lg:w-auto">
            <Navbar />
            <div className='lg:flex'>
                <div className='w-screen lg:w-1/2 h-[50vh] ml-[5vw] sm:ml-[8vw] md:ml-[22vw] lg:ml-32 mt-[10vh] md:mt-[23vh]'>
                    <h1 style={{ fontFamily: 'MyCustomFont' }} className='w-[80%] sm:w-[80%] md:w-[70%] lg:w-[65%] text-[30px] sm:text-[30px] md:text-[35px] lg:text-[50px] font-[500] text-[#FFFFFF] md:-pt-8'>
                        {heading}
                    </h1>
                    <h2 style={{ fontFamily: "QuickSand" }} className='w-[90vw] sm:w-[90%] md:w-[70%] lg:w-[40%] text-[15px] sm:text-[24px] font-[400] text-[#FFFFFF]'>
                        {description}
                    </h2>
                    <button className='w-[50vw] sm:w-[40vw] md:w-[30vw] lg:w-[50%] h-[5vh] bg-[#FCD37B] hover:text-white mt-8 explore-button'>
                        <span>{button}</span>
                    </button>
                </div>
                <div className='w-[100%] sm:w-[100%] md:w-[80%] lg:w-1/2 h-[40vh]'>
                    <div className='max-w-[1920px] mx-auto relative w-full h-[60vh] lg:h-[100vh] lg:w-[90%] -mt-[60vh] sm:-mt-[60vh]  md:ml-[13vw] lg:ml-0 md:-mt-[65vh] lg:mt-8'>
                        <img src="/image/Group.png" alt="" className='h-full w-full' />
                    </div>
                    <div className='relative'>
                        <div className='hidden lg:flex absolute w-[15vw] sm:w-[30vw] md:w-[40%] h-[50vh] ml-[5%] sm:ml-[12%] md:ml-[15%] sm:-mt-[120%] md:-mt-[80vh] -mt-[50%] image-stack'>
                            <img src="/image/Component 27.png" alt="" className='stacked-image' />
                            <img src="/image/Component 43.png" alt="" className='stacked-image' />
                            <img src="/image/Component 45.png" alt="" className='stacked-image' />
                            <img src="/image/Component 28.png" alt="" className='stacked-image' />
                        </div>
                    </div>
                </div>
            </div>
            <Circle />
            <TopSelling />
            <Collections />
            <CollectionTypes />
            <div className='flex flex-col sm:flex-row h-[80vh] sm:h-[48vh] bg-cover bg-center bg-no-repeat ' style={{ backgroundImage: `url("/image/background3.gif")` }}>
                <h1 className='flex sm:hidden text-[30px] sm:text-[35px] font-[700] text-[#FFFFFF] ml-[35%] sm:ml-0'>About Artist</h1>
                <div className='relative w-[80%] sm:w-1/2 flex items-center justify-center ml-[5%] sm:ml-0  sm:mt-0'>
                    <div className='h-[150px] md:h-[150px] lg:h-[150px] 2xl:h-[200px]'>
                        <img src="/image/man's_cover.svg" alt="" className='h-full' />
                    </div>
                    <div className='absolute h-[200px] sm:h-[300px] md:h-[300px] 2xl:h-[350px]'>
                        <img src="/image/man.png" alt="" className='h-full' />
                    </div>
                </div>
                <div style={{ fontFamily: "QuickSand" }} className='w-full sm:w-1/2 flex flex-col gap-4 justify-center items-center sm:items-start text-[#FFFFFF]  mt-4 sm:mt-4'>
                    <h1 className='hidden sm:flex text-[35px] font-[700]'>About Artist</h1>
                    <h1 className='text-[25px] font-[500]'>Name</h1>
                    <p className='w-[80vw] text-center sm:text-start sm:w-[100%] md:w-[80%] lg:w-[70%] text-[17px] font-[400]'>
                        Lorem ipsum dolor sit amet consectetur. Aliquam viverra at nam risus auctor quis eu. Nunc mauris erat id suscipit nullam. Nibh imperdiet ac lectus augue sed luctus nibh. Iaculis ullamcorper nulla adipiscing consequat ante.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home
