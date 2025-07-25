import React, { useState, useEffect } from 'react';

const Collections = ({ collections,handleCurrentIndex,startIndex,visibleButtons,currIndex}) => {
    const [currentIndex, setCurrentIndex] = useState(currIndex); // Track the current starting index of the visible items

    // console.log("current index inside collection type" , currentIndex)

    // Handler for navigating up (previous items)
    const [animate, setAnimate] = useState(false);

    // Handler for navigating collections
    const handleClick = (index) => {
        setAnimate(true);
        setTimeout(() => {
            setCurrentIndex(currentIndex+index);
            handleCurrentIndex(currentIndex+index);
            setAnimate(false);
        }, 300); // Duration should match the animation duration
    };

    const upHandler = () => {
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 300);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1); // Decrement current index to show previous collections 
            handleCurrentIndex(currentIndex-1);
        }
        
    };

    // Handler for navigating down (next items)
    const downHandler = () => {
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 300);
        if (currentIndex < collections.length - 1) {
            setCurrentIndex(currentIndex + 1); // Increment current index to show next collections
            handleCurrentIndex(currentIndex+1);
        }
        
    };

    useEffect(()=>{
        setCurrentIndex(currIndex)
    },[currIndex])

    return (
        <div className='lg:sticky top-0 w-[100%] sm:w-[100%] lg:w-[35%] h-[100%] flex flex-row lg:flex-col md:gap-8  items-center justify-center mt-20'>
            {/* Up button */}
            <div className='pt-2 lg:pr-4 lg:pb-2'>
                <img
                    src="/Hero/up.png"
                    alt="Up"
                    onClick={upHandler}
                    className={`lg:h-[80px] hover:cursor-pointer ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''} -rotate-90 lg:rotate-0`}
                />
            </div>

            {/* Display collections */}
            <div className='lg:hidden w-[100%] flex flex-row lg:flex-col gap-4  pt-4 pb-4 pl-4'>
                {collections.slice(currentIndex, currentIndex + 2).map((collection, index) => (
                    <div
                        onClick={() => handleClick(index)}
                        key={index}
                        className={`cursor-pointer relative w-[100%] h-[6vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-transparent ${animate ? 'opacity-0 translate-x-[-50%]' : 'opacity-100 translate-x-0'}`}
                        style={{
                            backgroundColor: currentIndex + index === currentIndex ? collection.shadowColor : "inherit",
                            boxShadow: currentIndex + index === currentIndex ? `0 0 30px 10px ${collection.shadowColor}` : "", // Adjusted shadow
                        }}  
                    >
                        <div className='absolute h-[90%] top-0 left-0'>
                            <img src="/Hero/corner-small-left-bottom 1.png" alt="" className='h-full object-cover' />
                        </div>
                        <div className='absolute h-[90%] top-0 right-0'>
                            <img src="/Hero/corner-small-left-bottom 2.png" alt="" className='h-full object-cover' />
                        </div>
                        <div className='absolute h-[90%] bottom-0 left-0'>
                            <img src="/Hero/corner-small-left-bottom 3.png" alt="" className='h-full object-cover' />
                        </div>
                        <div className='absolute h-[90%] bottom-0 right-0'>
                            <img src="/Hero/corner-small-left-bottom 4.png" alt="" className='h-full object-cover' />
                        </div>
                        <h1
  className='text-lg text-center font-[400] text-white z-10'
  
>
{collection.name.length > 10 ? collection.name.slice(0,9)+"...": collection.name}
</h1>

                    </div>
                ))}
            </div>
            {/* for bigger screen */}
            <div className='hidden w-[100%] lg:flex flex-col items-center gap-12 '>
                {collections.slice(startIndex,startIndex+visibleButtons).map((collection, index) => (
                    <div
                        onClick={() => {
                            setCurrentIndex(collection.index)
                            handleCurrentIndex(collection.index);
                        }}
                        key={index}
                        className='cursor-pointer relative w-[50%] h-[55px] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-transparent'
                        style={{
                            backgroundColor: collection.index === currentIndex ? collection.shadowColor : "inherit",
                            boxShadow: collection.index === currentIndex ? `0 0 60px 10px ${collection.shadowColor}` : "",
                        }}
                    >
                        <div className='absolute h-[90%] top-0 left-0'>
                            <img src="/Hero/corner-small-left-bottom 1.png" alt="" className='h-full object-cover' />
                        </div>
                        <div className='absolute h-[90%] top-0 right-0'>
                            <img src="/Hero/corner-small-left-bottom 2.png" alt="" className='h-full object-cover' />
                        </div>
                        <div className='absolute h-[90%] bottom-0 left-0'>
                            <img src="/Hero/corner-small-left-bottom 3.png" alt="" className='h-full object-cover' />
                        </div>
                        <div className='absolute h-[90%] bottom-0 right-0'>
                            <img src="/Hero/corner-small-left-bottom 4.png" alt="" className='h-full object-cover' />
                        </div>
                        <h1 className='text-lg font-[400] text-white z-10 uppercase' style={{fontFamily:'MyCustomFont'}}>{collection.name}</h1>
                    </div>
                ))}
            </div>

            {/* Down button */}
            <div>
                <img
                    src="/Hero/down.png"
                    alt="Down"
                    onClick={downHandler}
                    className={` lg:h-[80px] hover:cursor-pointer ${currentIndex >= collections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''} -rotate-90 lg:rotate-0`}
                />
            </div>
        </div>
    );
};

export default Collections;
