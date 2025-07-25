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
  Box,
  Button,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { SkeletonTheme } from "react-loading-skeleton";
import { CopyToClipboard } from "react-copy-to-clipboard";

function Allorder() {
  const { backendActor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allorder, setallorder] = useState([]);
  let [currentpage, setcurrentpage] = useState(1);
  const [totalpage, settotalpage] = useState();

  const getallorder = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.getallOrders(10, currentpage - 1);
        console.log(result);

        if (result.err === "No orders found") {
          setallorder([]); // Set to an empty array if no orders found
        } else {
          setallorder(Array.isArray(result.ok.data) ? result.ok.data : []);
          setcurrentpage(Number(result.ok.current_page));
          settotalpage(Number(result.ok.total_pages));
        }
      } catch (error) {
        console.error("Error fetching allorders:", error);
        setallorder([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getallorder();
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    toast.success("Copied");
  };
  const leftfunction = async () => {
    if (currentpage == 1) {
      toast.error("You are in first page");
    }
    currentpage = currentpage - 1;
    await getallorder();
  };
  const rightfunction = async () => {
    if (currentpage > totalpage) {
      toast.error("You are in last page");
    }
    currentpage = currentpage + 1;
    await getallorder();
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
                      Order Id
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
                    Array(5)
                      .fill("")
                      .map((_, index) => (
                        <Tr key={index}>
                          <Td>
                            <Skeleton height={20} width="80%" />
                          </Td>
                          <Td>
                            <Skeleton height={20} width="80%" />
                          </Td>
                          <Td>
                            <Skeleton height={20} width="60%" />
                          </Td>
                          <Td>
                            <Skeleton height={20} width="60%" />
                          </Td>
                        </Tr>
                      ))
                  ) : Array.isArray(allorder) && allorder.length === 0 ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center" color="gray.400">
                        No order found
                      </Td>
                    </Tr>
                  ) : (
                    Array.isArray(allorder) &&
                    allorder.map((orderdata, index) => {
                      const userPrincipalArray = orderdata.collectionCanisterId;
                      const principal = userPrincipalArray
                        ? Principal.fromUint8Array(
                            userPrincipalArray._arr
                          ).toText()
                        : null;

                      const userorderArray = orderdata.accountIdentifier;
                      const orderid = userorderArray
                        ? Principal.fromUint8Array(userorderArray._arr).toText()
                        : null;

                      if (!orderid) {
                        return (
                          <Tr key={index}>
                            <Td colSpan={4} textAlign="center" color="gray.400">
                              No order found
                            </Td>
                          </Tr>
                        );
                      }

                      return (
                        <Tr
                          key={index}
                          bg={index % 2 === 0 ? "#333333" : "#282828"}
                        >
                          <Td textAlign="center">{index + 1}</Td>
                          <Td
                            textAlign="center"
                            wordBreak="break-all"
                            color="gray.200"
                          >
                            {`${orderid.slice(0, 4)}...${orderid.slice(-4)}`}
                            <CopyToClipboard text={orderid} onCopy={handleCopy}>
                              <button className="ml-3">
                                <CopyIcon />
                              </button>
                            </CopyToClipboard>
                          </Td>
                          <Td textAlign="center" color="white.200">
                            {`${principal.slice(0, 4)}...${principal.slice(
                              -4
                            )}`}
                            <CopyToClipboard
                              text={principal}
                              onCopy={handleCopy}
                            >
                              <button className="ml-3">
                                <CopyIcon />
                              </button>
                            </CopyToClipboard>
                          </Td>
                          <Td textAlign="center">
                            <Link
                              to={`/Admin/activity/allorder/${principal}`}
                              state={{ orderdata }}
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
                      );
                    })
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

export default Allorder;
