import React from 'react'

function DashBoard() {
  return (
    <div className=' bg-contain text-white m-auto text-center w-full h-full px-12 md:px-24 pt-20 2xl:pt-[10%] 2xl:ml-[7%]'>
      <div  className='grid grid-cols-1 sm:grid-cols-4  gap-8 max-w-screen-2xl justify-center mx-auto font-Quicksand sm:font-bold' >
        <div className='bg-[#29292C] px-6 py-4 col-span-2 h-32 2xl:h-52 flex flex-col justify-center rounded-md'>
          <h3>Total Collections</h3>
          <p>2</p>
        </div>
        <div  className='bg-[#29292C] px-6 py-4 col-span-2 h-32 2xl:h-52 flex flex-col justify-center rounded-md'>
          <h3>Total NFTs</h3>
          <p>2</p>
        </div>
          <div  className='bg-[#29292C] px-6 py-4 col-span-2 sm:col-start-2 sm:col-end-4 h-32 2xl:h-52 flex flex-col justify-center rounded-md'>
            <h3>Total Users</h3>
            <p>1</p>
          </div>
      </div>

    </div>
  )
}

export default DashBoard