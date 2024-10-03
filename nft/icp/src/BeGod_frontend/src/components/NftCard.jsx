import { Principal } from '@dfinity/principal'
import { useAuth } from '../utils/useAuthClient'
import React,{useState} from 'react'
import MoonLoader from "react-spinners/MoonLoader";
import { Link } from 'react-router-dom';


const NftCard = ({img,removeFromFavorites,addToFavorites}) => {

    const [showLoader,updateLoaderStatus] = useState(false);

    const onClickRemove = async() => {
        updateLoaderStatus(true);
        if(img.isFavourite){
           await removeFromFavorites(img.tokenId);

        }else{
         await addToFavorites(img.tokenId)
        }
        updateLoaderStatus(false)
    }
    // console.log("img",img)
    return (

        <div
            className={`rounded-lg flip-card ${!img.isOwned && "filter grayscale"}`}
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className={`flip-card-inner`}>
                {/* Front Side */}
                <div className={`flex items-center justify-center flip-card-front`}>
                    <img src={img.cardImageUrl} alt={`NFT`} className="w-[98%] h-[98%] rounded-lg object-cover" />
                </div>
                {/* Back Side */}
                <div className="relative flex flex-col items-center justify-center text-white flip-card-back ">
                    <img src={img.cardImageUrl} alt={`NFT`} className="object-cover blur-sm w-[98%] h-[98%]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg bg-opacity-60">
                        <h1 className="text-xl font-extrabold sm:text-3xl lg:text-2xl">{img.cardName}</h1>
                        <h2 className="mt-2 text-lg sm:text-xl">Sold: {img.sold}/100</h2>
                        {!img.isOwned && (<h2 className="mt-1 text-lg sm:text-xl">{img.ICP} ICP</h2>)}
                        {img.isOwned ? (
                            (showLoader ? (
                                <div className='flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon'>
                                 <MoonLoader
                                 color="#000000"
                                 size={15}
                                 aria-label="Loading Spinner"
                                 data-testid="loader"
                               />
                               </div>
                            ):(
                                <>
                                <button  onClick={onClickRemove}
                            className="flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon">
                                {img.isFavourite ? "Remove" : "Add to Favourite"}
                            </button>
                            
                            </>
                            )
                        )
                            
                        ):(
                            <Link to={`/Nft/${img.name}/buy?collectionId=${img.collectionId}&index=${img.cardIndex}`} className="flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[40%] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105">
                                Buy Now
                            </Link>
                        )}
                        {img.isOwned && (
                            <Link to={`/Nft/${img.cardName}/buy?collectionId=${img.collectionId}&index=${img.index}`}
                            className="flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon">
                                View Details
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NftCard