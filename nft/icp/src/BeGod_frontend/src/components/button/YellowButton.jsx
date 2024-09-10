import { Button } from '@chakra-ui/react'
import React from 'react'

function YellowButton({children}) {
  return (
    <Button 
    bg="#FCD37B"  // Initial background color
    rounded="3px"  // Border radius
    _hover={{ bg: "#D4A849", borderColor: "#D4A849" }}  // Hover color and border color change
    className='border border-[#fcd37b]'  // Initial border color
  >
    {children}
  </Button>
  
  )
}

export default YellowButton