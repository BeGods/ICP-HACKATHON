import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "@chakra-ui/react";
import BackButton from "./collection/BackButton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { SkeletonTheme } from "react-loading-skeleton";

function Users() {
  const { backendActor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alluser, setalluser] = useState([]);
  const [principal, setprincipal] = useState([]);

  const getallDUser = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.getAllUsers();
        console.log("getting all users", result);

        if (result && result.length > 0 && result[0].length > 0) {
          setalluser(result);
          const userPrincipalArray = result[0][0];
          const principalString = Principal.fromUint8Array(
            userPrincipalArray._arr
          ).toText();
          console.log(principalString);
          setprincipal(principalString);
        } else {
          console.log("No users found in the result");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getallDUser();
      setLoading(false);
    };

    fetchData();
  }, []);

  console.log(alluser[0]);
  const n = alluser?.length || 0;
  console.log("length", n);
  // console.log(principal);
  // const userPrincipalArray = principal;
  // const principalString = Principal.fromUint8Array(
  //   userPrincipalArray._arr
  // ).toText();
  // console.log(principalString);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll  md:w-full lg:w-[90%] lg:pt-20">
        <div className="flex justify-between text-center">
          <BackButton />
        </div>

        <Box
          color="white"
          className="flex flex-col items-center justify-center"
        >
          {/* Search Box */}
          <Box
            w={{ base: "90%", sm: "100%", md: "85%", "2xl": "90%" }}
            mx={{ base: "4%", sm: "8%", md: "7%", lg: "7%", "2xl": "10%" }}
            mt="5%"
          >
            <Input
              placeholder="Search"
              w={{ base: "100%", sm: "90%", md: "85%", "2xl": "100%" }}
              h="45px"
              border="1px"
              borderColor="gray.600"
              bg="#161618"
              color="white"
              p="4"
              _placeholder={{ color: "gray.400" }}
            />
          </Box>
          {/* Table */}

          <Box
            w={{ base: "90%", sm: "100%", md: "85%", "2xl": "90%" }}
            mx={{ base: "4%", sm: "8%", md: "7%", lg: "7%", "2xl": "10%" }}
            mt="5%"
            className="whitespace-simple"
          >
            <TableContainer w={"100%"}>
              <Table
                variant="simple"
                border="1px solid transparent"
                rounded="md"
              >
                <Thead bg="#FCD37B">
                  <Tr>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Name
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Email
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Principal
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Details
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <div
                      style={{
                        display: "grid",
                        lineHeight: 3,
                        padding: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Skeleton />
                      <Skeleton count={5} />
                    </div>
                  ) : (
                    <>
                      {Array(n)
                        .fill("")
                        .map((_, index) => (
                          <Tr
                            key={index}
                            bg={index % 2 === 0 ? "#333333" : "#444444"}
                          >
                            <Td textAlign="center">
                              <div className="flex items-center justify-center gap-4">
                                <img
                                  src="/image/admin.png"
                                  alt=""
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                  }}
                                />
                                {alluser[0][3]}
                              </div>
                            </Td>
                            <Td
                              textAlign="center"
                              wordBreak="break-all"
                              color="gray.200"
                            >
                              {alluser[0][4]}
                            </Td>
                            <Td textAlign="center" color="white.200">
                              {principal}
                            </Td>
                            <Td textAlign="center">
                              <Link
                                to={`/Admin/users/${alluser[0][2]}`}
                                state={{ alluser }}
                              >
                                <Button
                                  size="sm"
                                  border="1px"
                                  borderColor="gray.500"
                                  color="white"
                                  bg="#161618"
                                  _hover={{ bg: "#FCD37B", color: "black" }}
                                >
                                  View
                                </Button>
                              </Link>
                            </Td>
                          </Tr>
                        ))}
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              mt="5%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                mr="2"
                bg="#161618"
                color="white"
                border="1px"
                borderColor="gray.500"
                _hover={{ bg: "black" }}
              >
                &lt;
              </Button>
              <Button
                bg="#FCD37B"
                color="black"
                border="1px"
                borderColor="black"
                _hover={{ bg: "#D4A849" }}
              >
                1
              </Button>
              <Button
                ml="2"
                bg="#161618"
                color="white"
                border="1px"
                borderColor="gray.500"
                _hover={{ bg: "black" }}
              >
                &gt;
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
    </SkeletonTheme>
  );
}

export default Users;
