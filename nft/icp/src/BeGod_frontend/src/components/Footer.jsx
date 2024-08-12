import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <div style={{fontFamily:"QuickSand"}}  className='w-full h-[287px] text-[#FFFFFF]'>
            <h1 className='ml-[20%] pt-[5%]'>Logo</h1>
            <div className='flex ml-[20%] mt-4'>
                <p className='w-[25%]'>Lorem ipsum dolor sit amet consectetur. Ac at adipiscing volutpat mi. Mauris faucibus sed justo aenean urna varius mauris magna ut. Donec sit sed nisi sed adipiscing dictum. Vel vel scelerisque diam eget netus aliquam cursus nunc.</p>
                <div className='flex gap-24 ml-[10%]'>
                    <div className='flex flex-col gap-4'>
                        <h1>Home</h1>
                        <Link to="#" className='flex items-center justify-center gap-2 h-[8%]'>
                            <img src="/image/col1.png" alt="" className='h-full'/>
                            <h1>Norse Collection</h1>
                        </Link>
                        <Link to="#" className='flex items-center justify-center gap-2 h-[8%]'>
                            <img src="/image/col4.png" alt="" className='h-full'/>
                            <h1>Celtic Collection</h1>
                        </Link>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <h1>Collection</h1>
                        <Link to="#" className='flex items-center justify-center gap-2 h-[8%] pr-4'>
                            <img src="/image/col3.png" alt="" className='h-full'/>
                            <h1>Greece Collection</h1>
                        </Link>
                        <Link to="#" className='flex items-center justify-center gap-2 h-[8%]'>
                            <img src="/image/col2.png" alt="" className='h-full'/>
                            <h1>Egyptan Collection</h1>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
