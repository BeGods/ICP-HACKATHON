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
  IconButton,
  list,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons"; // Import CloseIcon from Chakra UI
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../utils/useAuthClient.jsx";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { SkeletonTheme } from "react-loading-skeleton";
import CollectionDetails from "./collection/CollectionDetails.jsx";
import { CopyIcon } from "@chakra-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

function Users() {
  const { backendActor } = useAuth();

  const [loading, setLoading] = useState(false);
  const [alluser, setalluser] = useState([]);
  const [principal, setprincipal] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [copiedtokenid, setcopiedtokenid] = useState("");

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();
        console.log(result);
        if (result && result[0] && result[0][1]) {
          console.log(result[0][1]);
          checktranscations(result[0][1]);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  const checktranscations = async (Collection) => {
    const listtime = [];
    for (let i = 0; i < Collection.length; i++) {
      const userPrincipalArray = Collection[i][1];

      const principalString = Principal.fromUint8Array(userPrincipalArray._arr);
      const result = await backendActor?.transactions(principalString);

      console.log(result);

      // Check if the result is not empty before setting the state
      if (result && Array.isArray(result) && result.length > 0) {
        setalldata(result);
        console.log("Data stored:", result);
        setLoading(false);
      } else {
        console.log("No data to store for principal:", principalString);
      }
    }
  };
  console.log(alldata[0]);
  // const timeinmilisecond = Number(alldata[0]?.[2].time) / 1000000;
  // const transactionTime = new Date(timeinmilisecond); // Create a Date object for the transaction time

  // // Get the current time
  // const currentTime = new Date();

  // // Calculate the difference in milliseconds and convert to days
  // const timeDifferenceInMilliseconds = currentTime - transactionTime;
  // const daysDifference = Math.floor(
  //   timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
  // ); // Convert to days

  // console.log(`Transaction was ${daysDifference} day(s) ago.`);

  useEffect(() => {
    const fetchCollection = async () => {
      await getCollection();
    };

    fetchCollection();
  }, [backendActor]);

  const handleCopy = () => {
    toast.success("Copied");
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar md:w-full lg:w-[90%] lg:pt-20">
        <Box
          color="white"
          className="flex flex-col items-center justify-center"
        >
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
                      Serial No.
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      TokenIdentifier
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Buyer
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Price
                    </Th>
                    <Th textAlign="center" color="black" p={4} fontSize="md">
                      Time
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading
                    ? Array(5)
                        .fill("")
                        .map((_, index) => (
                          <Tr key={index}>
                            <Td>
                              <Skeleton height={20} width="80%" />
                            </Td>
                            <Td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Skeleton
                                  circle={true}
                                  height={30}
                                  width={30}
                                />
                                <Skeleton height={20} width="150px" />{" "}
                                {/* Name placeholder */}
                              </div>
                            </Td>
                            <Td>
                              <Skeleton height={20} width="80%" />
                            </Td>
                            <Td>
                              <Skeleton height={20} width="60%" />
                            </Td>
                            <Td>
                              <Skeleton height={20} width="40%" />
                            </Td>
                          </Tr>
                        ))
                    : alldata.map((user, index) => {
                        // Calculate time in milliseconds and difference in days
                        const timeInMilliseconds =
                          Number(user[2]?.time) / 1000000;
                        const transactionTime = new Date(timeInMilliseconds);
                        const currentTime = new Date();
                        const timeDifferenceInMilliseconds =
                          currentTime - transactionTime;
                        const daysDifference = Math.floor(
                          timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
                        );

                        return (
                          <Tr
                            key={index}
                            bg={index % 2 === 0 ? "#333333" : "#282828444"}
                          >
                            <Td
                              textAlign="center"
                              wordBreak="break-all"
                              color="gray.200"
                            >
                              {index + 1}
                            </Td>
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
                                {`${user[1].slice(0, 4)}...${user[1].slice(
                                  -4
                                )}`}
                                <CopyToClipboard
                                  text={user[1]}
                                  onCopy={handleCopy}
                                >
                                  <button className="ml-3">
                                    <CopyIcon />
                                  </button>
                                </CopyToClipboard>
                              </div>
                            </Td>
                            <Td
                              textAlign="center"
                              wordBreak="break-all"
                              color="gray.200"
                            >
                              {`${user[2]?.buyer.slice(
                                0,
                                4
                              )}...${user[2]?.buyer.slice(-4)}`}
                              <CopyToClipboard
                                text={user[2]?.buyer}
                                onCopy={handleCopy}
                              >
                                <button className="ml-3">
                                  <CopyIcon />
                                </button>
                              </CopyToClipboard>
                            </Td>
                            <Td textAlign="center" color="white.200">
                              {Number(user[2].price) / 100000000} ICP
                            </Td>
                            <Td textAlign="center" color="white.200">
                              {daysDifference} days ago
                            </Td>
                          </Tr>
                        );
                      })}
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
