import React from 'react'
import YellowButton from '../../components/button/YellowButton'
import { collection } from '../../TextData'
import { Link } from 'react-router-dom'
function Collection() {
    return (
        <div className='custome_max_width overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll mx-auto'>
            <div className=' mx-auto '>
                <div className='flex justify-end gap-x-6 '>
                    <YellowButton>
                        <Link to="/Admin/collection/create">
                            Create Collection
                        </Link>
                    </YellowButton>
                    <YellowButton>
                        Add
                    </YellowButton>
                </div>
                <div className='grid grid-cols-3 gap-6 pt-10'>
                    {collection.collections.map((nft, index) => (
                        <div key={index} className='bg-[#29292C] p-4 text-white flex  flex-col justify-center items-center gap-y-4'>
                            <Link to={`/Admin/collection/collectionDetails/${nft.CollectionDetails?.collectionId}`}>
                                <img className='h-40 w-40' src={nft.img} alt="" />
                                <div className='mx-auto text-center font-Quicksand font-bold'>
                                    <p>{nft.text1}</p>
                                    <p>{nft.text2}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Collection