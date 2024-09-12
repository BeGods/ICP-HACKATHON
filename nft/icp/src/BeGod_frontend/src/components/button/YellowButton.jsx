import { Button } from '@chakra-ui/react'
import React from 'react'

function YellowButton({children}) {
  return (
    <Button bg="#FCD37B"  rounded="unset" _hover={{ bg: "#FCD390" }} className='w-[100%] '>
        {children}
    </Button>
  )
}

export default YellowButton