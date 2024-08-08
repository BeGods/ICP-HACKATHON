import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';
const NftCard = ({ id,list, img2 }) => {
    const [flip, setFlip] = useState(false);

    return (
        <ReactCardFlip isFlipped={flip} flipDirection="vertical">
            {/* Front Side */}
            <Link to={`/Admin/collection/collectionDetails/${id}/nft/252739454`}
                className='w-full h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] m-4 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-500'
                onMouseEnter={() => setFlip(true)}
            >
                <img 
                    src={list.img} 
                    alt="NFT Front" 
                    className='w-[80%] h-[80%] object-cover rounded-lg'
                />
            </Link>

            {/* Back Side */}
            <Link to={`/Admin/collection/collectionDetails/${id}/nft/252739454`}
                className='w-full h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]  m-4 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-500'
                onMouseLeave={() => setFlip(false)}
            >
                <img 
                    src={img2} 
                    alt="NFT Back" 
                    className='w-[80%] h-[80%] object-cover rounded-lg'
                />
            </Link>
        </ReactCardFlip>
    );
};

export default NftCard;
