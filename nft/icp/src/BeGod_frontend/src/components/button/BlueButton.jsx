import React from 'react'
import { Button } from '@chakra-ui/react'
const BlueButton = ({children}) => {
  return (
    <Button bg="#1E62AC" _hover={{ bg: "#FCD390" }} className='border-[1px] border-[#FFFFFF]'>
        {children}
    </Button>
  )
}

export default BlueButton
