import { ArrowBackIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { collection } from '../../TextData'
import { Link, useParams } from 'react-router-dom'
import YellowButton from '../../components/button/YellowButton'
import { useNavigate } from 'react-router-dom'
import NftCard from './NftCard'
function CollectionDetails() {
  const { id } = useParams()
  const filteredCollection = collection.collections.find((col) => col.CollectionDetails?.collectionId === id)
  console.log(filteredCollection)
  if (!filteredCollection) {
    <p>No Collection found</p>
  }
  const navigate = useNavigate();
  const { heading, img, detail, collectionId, heading2, NftList } = filteredCollection.CollectionDetails
  return (
    <div className=' h-screen overflow-y-scroll m-auto md:custome_max_width'>
      <div className=' space-y-4'>
        <div className='flex justify-start w-[35%] md:w-11/12 pt-9 hover:cursor-pointer'>
          <ArrowBackIcon onClick={() => navigate(-1)} color='white' />
        </div>
        <div className='flex justify-end w-[95%] sm:w-[90%] md:w-11/12'>
          <YellowButton>
            Remove Collection
          </YellowButton>
        </div>
        <div className='flex flex-col md:flex-row gap-x-8 items-center bg-[#414141] w-[95%] sm:w-[90%] md:w-11/12 px-8 py-4 text-[#FFFFFF] justify-center rounded-md'>
          <img className='w-32 h-32' src={img} alt="" />
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <h1 className='text-sm md:text-xl '>{heading}</h1>
              <div>Created on-25 May,2078</div>
            </div>
            <p className='font-Quicksand font-normal text-sm md:text-xl'>{detail}</p>
            <h3 className='font-Quicksand font-bold text-sm md:text-xl'>Collection ID-{collectionId}</h3>
          </div>
        </div>
        {/* flipping card */}
        <div className='w-full md:w-11/12 text-white pb-12'>
          <h1 className='text-xl'>{heading2}</h1>
          <div className='flex flex-row overflow-x-auto overflow-y-hidden md:flex-wrap justify-center md:gap-2 -ml-8 sm:mr-12 md:mr-0 sm:-ml-12 md:ml-0 -mt-8 md:mt-0'>
            {NftList.map((list, index) => (
              <NftCard id={id} list={list} img2={img} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionDetails