import React, { useState, useEffect } from 'react';

const CollectionTypes = () => {
    const images = [
        {
            img: "/image/image 18.png",
            h: "Lorem ipsum",
            p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
            type: "Norse"
        },
        {
            img: "/image/image 20.png",
            h: "Lorem ipsum",
            p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
            type: "Norse"
        },
        {
            img: "/image/image 23.png",
            h: "Lorem ipsum",
            p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
            type: "Norse"
        },
        {
            img: "/image/image 25.png",
            h: "Lorem ipsum",
            p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
            type: "Norse"
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!hover) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [hover, images.length]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div
            style={{ fontFamily: "QuickSand" }}
            className="flex mt-12 relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="h-[80%] w-full md:w-1/2 flex items-end">
                <img src={images[currentIndex].img} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-center items-end sm:items-start sm:right-32 sm:bottom-40 p-4 w-[80%] sm:w-1/2 bg-white bg-opacity-20 sm:bg-inherit text-white">
                <h1 className="text-[20px] sm:text-[30px] font-[400] leading-[40px] text-right sm:text-left">
                    {images[currentIndex].h}
                </h1>
                <p className="w-[100%] md:w-[57%] text-[15px] font-[400] leading-[20px] text-right sm:text-left">
                    {images[currentIndex].p}
                </p>
                <button className='w-[50vw] sm:w-[30vw] md:w-[15vw] h-[4vh] bg-black text-white mt-4'>
                    <span>{images[currentIndex].type} Collection</span>
                </button>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                    onClick={handlePrevious}
                    className="bg-black text-white p-2 opacity-70 hover:opacity-100"
                >
                    &#9664;
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                    onClick={handleNext}
                    className="bg-black text-white p-2 opacity-70 hover:opacity-100"
                >
                    &#9654;
                </button>
            </div>
        </div>
    );
}

export default CollectionTypes;
