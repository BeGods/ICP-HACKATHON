import { Principal } from '@dfinity/principal'
import { useAuth } from '../utils/useAuthClient'
import React,{useState} from 'react'
import MoonLoader from "react-spinners/MoonLoader";
import { Link } from 'react-router-dom';


const NftCard = ({img,data}) => {
    const {asset,description,metadata,name,thumbnail} = data[2].nonfungible;
    const price = parseInt(BigInt(data[3][0]));
    const actualPrice = parseFloat(price/100000000).toFixed(3);
    console.log(actualPrice)
    const parsedData = JSON.parse(metadata[0].json);
    console.log(data)
    const {chain,standerd,date,nftcolor,nfttype} = (parsedData);

    const [showLoader,updateLoaderStatus] = useState(false);

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
                <div className="flex items-center justify-center flip-card-front ">
                    <img src={thumbnail} alt={`NFT`} className="w-[98%] h-[98%] rounded-lg object-cover" />
                </div>
                {/* Back Side */}
                <div className="relative flex flex-col items-center justify-center text-white flip-card-back ">
                    <img src={thumbnail} alt={`NFT`} className="object-cover blur-sm w-[98%] h-[98%]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg bg-opacity-60">
                        <h1 className="text-xl font-extrabold sm:text-3xl lg:text-2xl">{name}</h1>
                        <h2 className="mt-2 text-lg sm:text-xl">Type: {nfttype}</h2>
                        <h2 className="mt-1 text-lg sm:text-xl">{actualPrice} ICP</h2>
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
""
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NftCard