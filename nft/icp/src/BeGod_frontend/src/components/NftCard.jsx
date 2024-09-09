import React from 'react'

const NftCard = ({img}) => {
    return (

        <div
            className="flip-card rounded-lg"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flip-card-inner w-[292px] h-[408px]">
                {/* Front Side */}
                <div className="flip-card-front flex items-center justify-center ">
                    <img src={img.img1} alt={`NFT`} className="w-[98%] h-[98%] rounded-lg object-cover" />
                </div>
                {/* Back Side */}
                <div className="flip-card-back relative flex flex-col justify-center items-center text-white ">
                    <img src={img.img1} alt={`NFT`} className="object-cover blur-sm w-[98%] h-[98%]" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 rounded-lg">
                        <h1 className="text-xl sm:text-3xl font-extrabold">{img.name}</h1>
                        <h2 className="text-lg sm:text-xl mt-2">Sold: {img.sold}/100</h2>
                        <h2 className="text-lg sm:text-xl mt-1">{img.ICP} ICP</h2>
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
