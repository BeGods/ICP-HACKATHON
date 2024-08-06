import React, { useState } from 'react'
import { Icon } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { CopyIcon } from '@chakra-ui/icons'
import { sideBarData } from '../../TextData';




function SideBar() {
  const [activelink, setActiveLink] = useState(0)



  return (
    <div className='bg-[#29292C] w-1/5 text-white   min-h-full font-Quicksand'>
      <div className='flex flex-col justify-between py-8  h-full min-h-lvh'>
        <div className='h-[90%] text-xl font-bold '>
          {sideBarData.map((text, index) => (
            <ul className='' key={index}>
              <RouterLink to={text.Link} onClick={() => setActiveLink(index)}>
              <li className={`flex gap-x-4 px-6 py-4 items-center cursor-pointer ${activelink == index ? "bg-[#FCD37B] text-black" : "bg-transparent"}`}>
                {activelink == index ? <Icon as={text.icon} color={'black'}/> : <Icon as={text.icon} />}
                <span>{text.text} </span>
              </li>
              </RouterLink>
            </ul>
          ))}
        </div>

        <div className='flex items-center justify-start gap-x-8 px-4'>
          <img className='w-12 h-12' src="/image/admin.png" alt="" />
          <div className='space-y-2'>
            <div className='flex gap-x-2'>
              <p className='text-base'>Admin</p>
              <button>
                <Icon as={MdLogout} />
              </button>
            </div>
            <div className='flex gap-x-2 items-center'>
              <p className='text-sm'>rfrnuv-fvfjuv-vnuvn</p>
              <CopyIcon />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SideBar