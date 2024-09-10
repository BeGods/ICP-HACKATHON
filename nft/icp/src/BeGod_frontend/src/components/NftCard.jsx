import React from 'react'

const NftCard = ({img}) => {
    return (

        <div
            className="rounded-lg flip-card"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flip-card-inner w-[292px] h-[408px]">
                {/* Front Side */}
                <div className="flex items-center justify-center flip-card-front ">
                    <img src={img.img1?img.img1:img.img} alt={`NFT`} className="w-[98%] h-[98%] rounded-lg object-cover" />
                </div>
                {/* Back Side */}
                <div className="relative flex flex-col items-center justify-center text-white flip-card-back ">
                    <img src={img.img1} alt={`NFT`} className="object-cover blur-sm w-[98%] h-[98%]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg bg-opacity-60">
                        <h1 className="text-xl font-extrabold sm:text-3xl">{img.name}</h1>
                        <h2 className="mt-2 text-lg sm:text-xl">Sold: {img.sold}/100</h2>
                        <h2 className="mt-1 text-lg sm:text-xl">{img.ICP} ICP</h2>
                        <button className="flex items-center justify-center mt-4 w-[60%] h-[5vh] sm:w-[40%] sm:h-[3vh] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NftCard
