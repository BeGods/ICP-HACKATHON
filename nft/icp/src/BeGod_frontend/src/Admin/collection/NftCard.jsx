import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NftCard = ({ id, list, img2 }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="nft-card">
            <Link 
                to={`/Admin/collection/collectionDetails/${id}/nft/${list.License_No}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className={`image-container ${hovered ? 'flipped' : ''}`}>
                    <img src={list.img} alt="NFT" className="image front" />
                    <img src={img2} alt="NFT Hover" className="image back" />
                </div>
            </Link>
        </div>
    );
};

export default NftCard;
