import React from 'react'

const Navbar = () => {
    return (
        <div className='w-full h-[10vh] flex items-center justify-between text-white'>
            <div className='flex gap-[20vw] ml-[8vw] pt-8'>
                <h1>Logo</h1>
                <div className='flex items-center gap-[5vw]'>
                    <div style={{fontFamily:'MyCustomFont'}}  className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF]'>
                        Home
                    </div>
                    <div style={{fontFamily:'MyCustomFont'}}  className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF]'>
                        Collection
                    </div>
                </div>
            </div>
            <div className='flex gap-8 mr-12 pt-8'>
                <input type="text" placeholder='Search' className='w-[13vw] h-[4vh] pl-4 text-white bg-inherit border-[2px] border-gray-200'/>
                <button style={{fontFamily:'MyCustomFont'}}  className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[13vw] h-[4vh]'>Connect Wallet</button>
            </div>
        </div>
    )
}

export default Navbar
