import React from 'react';
import notfound from "../4042.gif";

const PageNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
        
      <img src={notfound} alt="404" className='w-[40%] drop-shadow-lg' />
      <div><h1 className='text-4xl font-bold text-[#FCD37B]'>Page Not Found</h1></div>
    </div>
  )
}

export default PageNotFound