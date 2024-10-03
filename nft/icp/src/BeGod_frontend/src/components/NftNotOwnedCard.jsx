import { Principal } from '@dfinity/principal'
import { useAuth } from '../utils/useAuthClient'
import React,{useState} from 'react'
import MoonLoader from "react-spinners/MoonLoader";


const NftNotOwnedCard = (img) => {

    const [showLoader,updateLoaderStatus] = useState(false);
    return (

        <div
            className="rounded-lg flip-card"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flip-card-inner ">
                {/* Front Side */}
                <div className="flex items-center justify-center flip-card-front ">
                    <img src={img.cardImageUrl} alt={`NFT`} className="w-[98%] h-[98%] rounded-lg object-cover" />
                </div>
                {/* Back Side */}
                <div className="relative flex flex-col items-center justify-center text-white flip-card-back ">
                    <img src={img.cardImageUrl} alt={`NFT`} className="object-cover blur-sm w-[98%] h-[98%]" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 rounded-lg">
                        <h1 className="text-xl sm:text-3xl lg:text-2xl font-extrabold">{img.cardName}</h1>
                        <h2 className="text-lg sm:text-xl mt-2">Sold: {img.sold}/100</h2>
                        <h2 className="text-lg sm:text-xl mt-1">1 ICP</h2>
                        {showLoader ? (
                            <div className='flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon'>
                             <MoonLoader
                             color="#000000"
                             size={15}
                             aria-label="Loading Spinner"
                             data-testid="loader"
                           />
                           </div>
                        ):(
                            <button  onClick={onClickRemove}
                        className="flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon">
                            {img.isFavourite ? "Remove" : "Add to Favourite"}
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NftNotOwnedCard