import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';
import './nftcard.css';

const NftCard = ({ id, list }) => {
    const [flip, setFlip] = useState(false);

    return (
        <div className="nftcard-container sm:mt-12 md:mt-4 w-[20%] h-[30%]">
            <ReactCardFlip isFlipped={flip} flipDirection="horizontal">
                {/* Front Side */}
                <div
                    className={`nftcard nftcard-front ${flip ? 'flipped' : ''}`}
                    onMouseEnter={() => setFlip(true)}
                >
                    <Link
                        to={`/Admin/collection/collectionDetails/${id}/nft/252739454`}
                        className='sm:w-[100%] sm:h-[60%] flex items-center justify-center cursor-pointer'
                    >
                        <img
                            src={list.img}
                            alt="NFT Front"
                            className='w-full h-full object-cover rounded-lg'
                        />
                    </Link>
                </div>

                {/* Back Side */}
                <div
                    className={`nftcard nftcard-back ${flip ? 'flipped' : ''}`}
                    onMouseLeave={() => setFlip(false)}
                >
                    <Link
                        to={`/Admin/collection/collectionDetails/${id}/nft/252739454`}
                        className='sm:w-[100%] sm:h-[60%] flex items-center justify-center cursor-pointer'
                    >
                        <img
                            src={list.img}
                            alt="NFT Back"
                            className='w-full h-full object-cover rounded-lg'
                        />
                    </Link>
                </div>
            </ReactCardFlip>
        </div>
    );
};

export default NftCard;
