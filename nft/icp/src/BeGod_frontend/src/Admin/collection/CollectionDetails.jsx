import { ArrowBackIcon } from '@chakra-ui/icons'
import React from 'react'
import { collection } from '../../TextData'
import { useParams } from 'react-router-dom'
import YellowButton from '../../components/button/YellowButton'

function CollectionDetails() {
  const { id } = useParams()
  const filteredCollection = collection.collections.find((col) => col.CollectionDetails?.collectionId === id)
  console.log(filteredCollection)
  if (!filteredCollection) {
    <p>No Collection found</p>
  }

  const { heading, img, detail, collectionId, heading2, NftList } = filteredCollection.CollectionDetails
  return (
    <div className=' h-screen overflow-y-scroll m-auto custome_max_width'>
      <div className='mx-auto space-y-4'>
        <div className=' flex justify-start mx-auto w-11/12 pt-9'>
          <ArrowBackIcon color='white' />
        </div>
        <div className='flex justify-end mx-auto w-11/12'>
          <YellowButton>
            Remove Collection
          </YellowButton>
        </div>
        <div className='flex gap-x-8 items-center bg-[#414141] w-11/12 mx-auto px-8 py-4 text-[#FFFFFF] justify-center'>
          <img className='w-32 h-32' src={img} alt="" />
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <h1 className='text-xl '>{heading}</h1>
              <div>Created on-25 May,2078</div>
            </div>
            <p className='font-Quicksand font-normal'>{detail}</p>
            <h3 className='font-Quicksand font-bold'>Collection ID-{collectionId}</h3>
          </div>
        </div>
        {/* flipping card */}
        <div className='mx-auto w-11/12 text-white pb-12'>
          <h1>{heading2}</h1>
         <div className='flex justify-between '>
         {NftList.map((list, index) => (
            <div key={index}>
             <img src={list.img} alt="" />

          </div>))}
         </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionDetails