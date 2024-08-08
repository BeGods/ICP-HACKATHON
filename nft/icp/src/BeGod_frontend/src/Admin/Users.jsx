import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Box,
  Button,
} from '@chakra-ui/react';

function Users() {
  const id = 1951982;
  return (
    <Box color='white'>
      <Box mt='5%' mx={{ base: '4%', md: '10%' }}>
        <Input
          placeholder='Search'
          w={{ base: '50%', sm: '90%', md: '948px' }}
          h='35px'
          border='1px'
          borderColor='white'
          bg='black'
          p='4'
        />
      </Box>
      <Box w={{ base: '45%', sm: '83%', md: '948px' }} mx={{ base: '4%', md: '10%' }} mt='5%'>
        <TableContainer>
          <Table variant='simple'>
            <Thead bg='#FCD37B'>
              <Tr>
                <Th color='black' textAlign='center'>Name</Th>
                <Th color='black' textAlign='center'>Email</Th>
                <Th color='black' textAlign='center'>Principal</Th>
                <Th color='black' textAlign='center'>Details</Th>
              </Tr>
            </Thead>
            <Tbody bg='#29292C'>
              <Tr>
                <Td textAlign='center'>Barry</Td>
                <Td textAlign='center' wordBreak='break-all'>Tonya_Barrows@yahoo.com</Td>
                <Td textAlign='center'>1951982</Td>
                <Td textAlign='center'>
                  <Link to={`/Admin/users/${id}`}>
                    <Button
                      size='sm'
                      border='1px'
                      borderColor='white'
                      color='white'
                      bg='black'
                      _hover={{ bg: 'gray.700' }}
                    >
                      View
                    </Button>
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td textAlign='center'>Barry</Td>
                <Td textAlign='center' wordBreak='break-all'>Tonya_Barrows@yahoo.com</Td>
                <Td textAlign='center'>1951982</Td>
                <Td textAlign='center'>
                  <Link to={`/Admin/users/${id}`}>
                    <Button
                      size='sm'
                      border='1px'
                      borderColor='white'
                      color='white'
                      bg='black'
                      _hover={{ bg: 'gray.700' }}
                    >
                      View
                    </Button>
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td textAlign='center'>Barry</Td>
                <Td textAlign='center' wordBreak='break-all'>Tonya_Barrows@yahoo.com</Td>
                <Td textAlign='center'>1951982</Td>
                <Td textAlign='center'>
                  <Link to={`/Admin/users/${id}`}>
                    <Button
                      size='sm'
                      border='1px'
                      borderColor='white'
                      color='white'
                      bg='black'
                      _hover={{ bg: 'gray.700' }}
                    >
                      View
                    </Button>
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td textAlign='center'>Barry</Td>
                <Td textAlign='center' wordBreak='break-all'>Tonya_Barrows@yahoo.com</Td>
                <Td textAlign='center'>1951982</Td>
                <Td textAlign='center'>
                  <Link to={`/Admin/users/${id}`}>
                    <Button
                      size='sm'
                      border='1px'
                      borderColor='white'
                      color='white'
                      bg='black'
                      _hover={{ bg: 'gray.700' }}
                    >
                      View
                    </Button>
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Box mt='5%' style={{ display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Button mr='2'>&lt;</Button>
          <Button bg='#FCD37B' color='black' border='1px' borderColor='black'>
            1
          </Button>
          <Button ml='2'>&gt;</Button>
        </Box>
      </Box>

    </Box>
  );
}

export default Users;
