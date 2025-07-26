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
import { CloseIcon } from "@chakra-ui/icons";
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
import BackButton from "./collection/BackButton.jsx";
import YellowButton from "../components/button/YellowButton";
function Users() {
  const { backendActor } = useAuth();

  const [loading, setLoading] = useState(false);
  const [alluser, setalluser] = useState([]);
  const [principal, setprincipal] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [copiedtokenid, setcopiedtokenid] = useState("");
  const [coll, setColl] = useState([]);
  let [currentpage, setcurrentpage] = useState(1);
  const [totalpage, settotalpage] = useState();

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();
        console.log(result);
        const tempArray = [];

        if (result && Array.isArray(result)) {
          result.forEach((item) => {
            if (item && item.length > 1) {
              // console.log(item);
              item[1].forEach((value) => {
                // console.log(value);
                if (value && value.length > 1) {
                  tempArray.push(value);
                }
              });
            }
          });

          console.log(tempArray);
          setColl(tempArray);
          checktranscations(tempArray);
        }
        // setColl(result.ok.data);
        // checktranscations(result.ok.data);
        // console.log(result.ok.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  // const checktranscations = async (Collection) => {
  //   const listdata = [];

  //   for (let i = 0; i < Collection.length; i++) {
  //     const userPrincipalArray = Collection[i][1];
  //     try {
  //       const principalString = Principal.fromUint8Array(
  //         userPrincipalArray._arr
  //       );
  //       const result = await backendActor?.transactions(principalString);
  //       if (result && Array.isArray(result) && result.length > 0) {
  //         result.forEach((transactionArray) => {
  //           if (
  //             Array.isArray(transactionArray) &&
  //             transactionArray.length > 0
  //           ) {
  //             listdata.push(transactionArray);
  //           }
  //         });
  //         console.log("Transaction data added:", result);
  //       } else {
  //         console.log("No valid data for principal:", principalString);
  //       }
  //     } catch (error) {
  //       console.log(
  //         "Error fetching transactions for principal:",
  //         userPrincipalArray,
  //         error
  //       );
  //     }
  //   }
  //   if (listdata.length > 0) {
  //     setalldata(listdata);
  //     console.log("All successful individual arrays stored:", listdata);
  //   } else {
  //     console.log("No successful data to store.");
  //   }
  //   setLoading(false);
  // };

  // const checktranscations = async (Collection) => {
  //   try {
  //     const transactionPromises = Collection.map(async (item) => {
  //       const userPrincipalArray = item[1];
  //       console.log(item);

  //       try {
  //         const principalString = Principal.fromUint8Array(
  //           userPrincipalArray._arr
  //         );
  //         const result = await backendActor?.alltransactions(
  //           principalString,
  //           10,
  //           0
  //         );

  //         if (result && Array.isArray(result) && result.length > 0) {
  //           return result.filter(
  //             (transactionArray) =>
  //               Array.isArray(transactionArray) && transactionArray.length > 0
  //           );
  //         } else {
  //           console.log("No valid data for principal:", principalString);
  //           return [];
  //         }
  //       } catch (error) {
  //         console.log(
  //           "Error fetching transactions for principal:",
  //           userPrincipalArray,
  //           error
  //         );
  //         return [];
  //       }
  //     });

  //     const allResults = await Promise.all(transactionPromises);
  //     const listdata = allResults.flat();

  //     if (listdata.length > 0) {
  //       setalldata(listdata);
  //       console.log("All successful individual arrays stored:", listdata);
  //     } else {
  //       console.log("No successful data to store.");
  //     }
  //   } catch (error) {
  //     console.error("Error in checkTransactions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const gettransactions = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.alltransactions(10, currentpage - 1);
        console.log("getting all transactions", result);

        if (result.err === "No transactions found") {
          setalldata([]); // Set to an empty array if no transactions found
        } else {
          setalldata(result.ok.data);
          setcurrentpage(Number(result.ok.current_page));
          settotalpage(Number(result.ok.total_pages));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      await gettransactions();
    };

    fetchCollection();
  }, []);

  const handleCopy = () => {
    toast.success("Copied");
  };

  const leftfunction = async () => {
    if (currentpage == 1) {
      toast.error("You are in first page");
    }
    currentpage = currentpage - 1;
    await gettransactions();
  };
  const rightfunction = async () => {
    if (currentpage > totalpage) {
      toast.error("You are in last page");
    }
    currentpage = currentpage + 1;
    await gettransactions();
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar md:w-full lg:w-[90%] lg:pt-20">
        <div className="flex justify-between items-center w-full mb-6 mt-5">
          {/* Back button (hidden on small screens) */}
          <div className="hidden sm:block">
            <BackButton />
          </div>
          {/* Create allorder button */}
          <div className="flex space-x-4">
            <Link to="/Admin/activity/allorder">
              <YellowButton className="font-semibold">All Orders</YellowButton>
            </Link>
          </div>
        </div>
        <Box
          color="white"
          className="flex flex-col items-center justify-center"
        >
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
                  {loading ? (
                    Array(5)
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
                              <Skeleton circle={true} height={30} width={30} />
                              <Skeleton height={20} width="150px" />
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
                  ) : alldata.length > 0 ? (
                    alldata.map((user, index) => {
                      const timeInMilliseconds =
                        Number(user[2]?.time) / 1000000;
                      const transactionTime = new Date(timeInMilliseconds);
                      const currentTime = new Date();
                      const timeDifferenceInMilliseconds =
                        currentTime - transactionTime;

                      // Calculate total days difference
                      const totalDaysDifference = Math.floor(
                        timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
                      );

                      // Calculate months, remaining days, hours, and minutes
                      const monthsDifference = Math.floor(
                        totalDaysDifference / 30
                      );
                      const daysDifference = totalDaysDifference % 30;

                      const hoursDifference = Math.floor(
                        (timeDifferenceInMilliseconds % (1000 * 60 * 60 * 24)) /
                          (1000 * 60 * 60)
                      );
                      const minutesDifference = Math.floor(
                        (timeDifferenceInMilliseconds % (1000 * 60 * 60)) /
                          (1000 * 60)
                      );

                      // Constructing the output message with priority
                      let displayMessage = "";

                      if (monthsDifference > 0) {
                        displayMessage = `${monthsDifference} month${
                          monthsDifference > 1 ? "s" : ""
                        } ago`;
                      } else if (daysDifference > 0) {
                        displayMessage = `${daysDifference} day${
                          daysDifference > 1 ? "s" : ""
                        } ago`;
                      } else if (hoursDifference > 0) {
                        displayMessage = `${hoursDifference} hour${
                          hoursDifference > 1 ? "s" : ""
                        } ago`;
                      } else if (minutesDifference > 0) {
                        displayMessage = `${minutesDifference} minute${
                          minutesDifference > 1 ? "s" : ""
                        } ago`;
                      } else {
                        displayMessage = "Just now";
                      }

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
                              {`${user[1].slice(0, 4)}...${user[1].slice(-4)}`}
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
                            {displayMessage}
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center" color="gray.400">
                        No transactions found
                      </Td>
                    </Tr>
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
              {currentpage > 1 && (
                <Button
                  mr="2"
                  bg="#161618"
                  color="white"
                  border="1px"
                  borderColor="gray.500"
                  _hover={{ bg: "black" }}
                  onClick={leftfunction}
                >
                  &lt;
                </Button>
              )}
              <Button
                bg="#FCD37B"
                color="black"
                border="1px"
                borderColor="black"
                _hover={{ bg: "#D4A849" }}
              >
                {currentpage}
              </Button>
              {currentpage < totalpage && (
                <Button
                  ml="2"
                  bg="#161618"
                  color="white"
                  border="1px"
                  borderColor="gray.500"
                  _hover={{ bg: "black" }}
                  onClick={rightfunction}
                >
                  &gt;
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </SkeletonTheme>
  );
}

export default Users;
