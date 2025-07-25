import { Button } from '@chakra-ui/react';
import React from 'react';

function YellowButtonUserSide({ children, methodName }) {
  return (
    <Button
      bg="#FCD37B"  // Initial background color
      borderColor="#FCD37B"  // Initial border color
      rounded="3px"  // Border radius
      _hover={{ bg: "#D4A849", borderColor: "#D4A849" }}  // Hover styles: background and border color change
      borderWidth="1px"  // Explicitly set border width
      onClick={methodName}
      className='w-full'      
    >
      {children}
    </Button>
  );
}

export default YellowButtonUserSide;
