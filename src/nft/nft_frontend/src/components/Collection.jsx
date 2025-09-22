import { useEffect, useState } from "react";
import { Grid3X3, CircleFadingArrowUp, Gamepad2, Star } from "lucide-react";
import NFTModal from "./NFT/NFTModal";
import NFTCard from "./NFT/NFTCard";
import NFTUpgradeModal from "./NFT/NFTUpgrade";
import { useAuth } from "../utils/useAuthClient";
import DotGrid from "./DotGrid/DotGrid";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNFTUpgrade, setShowNFTUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noCollectionStatus, setNoCollectionStatus] = useState(false);
  const [collectionNFTData, setCollectionNFTData] = useState({});
  const { backendActor, principal, isAuthenticated } = useAuth({});
  const itemsPerPage = 30;

  // modal
  const openModal = (nft) => {
    nft.collection = collections[activeCollection].name;
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  const checkIsFavourite = async (tokenId) => {
    if (!principal || !isAuthenticated) return false;

    try {
      const ids = await backendActor?.getFavorites(principal);

      if (ids?.ok?.length > 0) {
        return ids.ok.includes(tokenId);
      }
    } catch (err) {
      console.error("Error checking favorites:", err);
    }

    return false;
  };

  // format nft data
  const formatCollNFTs = async (collectionList, collectionId, color) => {
    return Promise.all(
      collectionList.map(async (eachItem) => {
        const { nonfungible } = eachItem[3];
        const { thumbnail: image, name, description } = nonfungible;
        const tokenId = eachItem[1];
        const sold = eachItem[2].price;
        const ICP = parseInt(sold) / 100000000;
        const metadata = JSON.parse(nonfungible.metadata[0].json);

        const {
          nftType,
          nftcolor: borderColor,
          chain,
          date,
          arstistname,
          nftSeason,
          standard,
        } = metadata;
        console.log(metadata);

        const isFav = await checkIsFavourite(tokenId);

        return {
          id: `#${eachItem[0]}`,
          collectionId,
          index: eachItem[0],
          faceImg: image,
          description,
          cardImg: metadata.nftFullImage,
          tokenId,
          name,
          sold,
          price: ICP.toFixed(4),
          amount: eachItem[2].price,
          ICP,
          nftType,
          rarity: metadata.nftType || "Common",
          season: metadata.season || "Stone Age",
          borderColor,
          collectionColor: color,
          chain,
          date,
          arstistname,
          nftSeason,
          standard,
          isFav,
        };
      })
    );
  };
  // fetch nfts for a collection
  const fetchCollectionNfts = async (
    collectionId,
    color,
    page = 1,
    append = false
  ) => {
    try {
      setCollectionNFTData((prev) => ({
        ...prev,
        [collectionId]: {
          ...prev[collectionId],
          loading: true,
        },
      }));

      const result = await backendActor?.plistings(
        collectionId,
        itemsPerPage,
        page - 1
      );

      const listedNfts = result?.ok?.data || [];
      const totalPages = parseInt(result?.ok?.total_pages) || 1;

      // mo nfts in collectionms
      if (listedNfts.length === 0 && page === 1) {
        setCollectionNFTData((prev) => ({
          ...prev,
          [collectionId]: {
            nfts: [],
            currentPage: 1,
            totalPages: 1,
            loading: false,
          },
        }));
        return [];
      }

      const fetchedNfts = await formatCollNFTs(listedNfts, collectionId, color);

      setCollectionNFTData((prev) => ({
        ...prev,
        [collectionId]: {
          nfts: append
            ? [...(prev[collectionId]?.nfts || []), ...fetchedNfts]
            : fetchedNfts,
          currentPage: page,
          totalPages,
          loading: false,
        },
      }));

      return fetchedNfts;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setCollectionNFTData((prev) => ({
        ...prev,
        [collectionId]: {
          ...prev[collectionId],
          loading: false,
        },
      }));
      return [];
    }
  };

  // update nft fav state
  const updateNFTFavorite = (collectionId, tokenId, isFav) => {
    console.log("Yes I was called");

    setCollectionNFTData((prev) => {
      const collectionData = prev[collectionId];
      if (!collectionData) return prev;

      return {
        ...prev,
        [collectionId]: {
          ...collectionData,
          nfts: collectionData.nfts.map((nft) =>
            nft.tokenId === tokenId ? { ...nft, isFav } : nft
          ),
        },
      };
    });
  };

  // fetch collections
  const getCollections = async () => {
    try {
      setLoading(true);
      const result = await backendActor?.getAllCollections();

      if (!result || result.length === 0) {
        setNoCollectionStatus(true);
        setLoading(false);
        return;
      }

      const tempArray = [];
      if (result && Array.isArray(result)) {
        result.forEach((item) => {
          if (item && item.length > 1) {
            item[1].forEach((value) => {
              if (value && value.length > 1) {
                tempArray.push(value);
              }
            });
          }
        });
      }

      const collectionItems = tempArray;

      const tmpCol = collectionItems.map((eachItem, index) => {
        const jsonData = JSON.parse(eachItem[4]);
        let color = jsonData.collColor;

        if (color === "Yellow") {
          color = "#FFB300";
        }

        return {
          index,
          id: eachItem[2]?.toLowerCase(),
          name: eachItem[2],
          image: eachItem[2],
          collectionId: eachItem[1],
          description: jsonData.description,
          color,
        };
      });

      setCollections(tmpCol);

      if (tmpCol.length > 0) {
        const defaultCollection = tmpCol[0];
        await fetchCollectionNfts(
          defaultCollection.collectionId,
          defaultCollection.color,
          1
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setLoading(false);
    }
  };

  // handle change
  const handleCollectionChange = async (collectionIndex) => {
    if (collectionIndex === activeCollection) return;

    setActiveCollection(collectionIndex);
    const selectedCollection = collections[collectionIndex];

    if (!collectionNFTData[selectedCollection.collectionId]?.nfts?.length) {
      await fetchCollectionNfts(
        selectedCollection.collectionId,
        selectedCollection.color,
        1
      );
    }
  };

  // handle pagination
  const loadMoreNFTs = async () => {
    if (activeCollection >= collections.length) return;

    const selectedCollection = collections[activeCollection];
    const currentData = collectionNFTData[selectedCollection.collectionId];

    if (
      !currentData ||
      currentData.loading ||
      currentData.currentPage >= currentData.totalPages
    )
      return;

    await fetchCollectionNfts(
      selectedCollection.collectionId,
      selectedCollection.color,
      currentData.currentPage + 1,
      true
    );
  };

  // pagination
  const goToNextPage = async () => {
    if (activeCollection >= collections.length) return;

    const selectedCollection = collections[activeCollection];
    const currentData = collectionNFTData[selectedCollection.collectionId];

    if (
      !currentData ||
      currentData.loading ||
      currentData.currentPage >= currentData.totalPages
    )
      return;

    await fetchCollectionNfts(
      selectedCollection.collectionId,
      selectedCollection.color,
      currentData.currentPage + 1
    );
  };

  const goToPrevPage = async () => {
    if (activeCollection >= collections.length) return;

    const selectedCollection = collections[activeCollection];
    const currentData = collectionNFTData[selectedCollection.collectionId];

    if (!currentData || currentData.loading || currentData.currentPage <= 1)
      return;

    await fetchCollectionNfts(
      selectedCollection.collectionId,
      selectedCollection.color,
      currentData.currentPage - 1
    );
  };

  // current nft data
  const getCurrentNFTData = () => {
    if (activeCollection >= collections.length) return [];
    const selectedCollection = collections[activeCollection];
    return collectionNFTData[selectedCollection.collectionId]?.nfts || [];
  };

  // pagination info
  const getCurrentPaginationInfo = () => {
    if (activeCollection >= collections.length)
      return { currentPage: 1, totalPages: 1, loading: false };
    const selectedCollection = collections[activeCollection];
    const data = collectionNFTData[selectedCollection.collectionId];
    return {
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
      loading: data?.loading || false,
    };
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case "small":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8";
      case "large":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3";
      case "list":
        return "grid-cols-1";
      case "grid":
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
    }
  };

  useEffect(() => {
    (async () => await getCollections())();
  }, []);

  // loading
  if (loading) {
    return (
      <div className="bg-[#161616] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading collections...</p>
        </div>
      </div>
    );
  }

  // no collection
  if (noCollectionStatus) {
    return (
      <div className="bg-[#161616] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl">No collections found</p>
        </div>
      </div>
    );
  }

  const currentNFTData = getCurrentNFTData();
  const paginationInfo = getCurrentPaginationInfo();

  return (
    <div className="relative min-h-screen  pb-10 text-white pt-4 sm:pt-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-4 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 h-auto sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="https://media.publit.io/file/BeGods/logos/battle.gods.black.svg"
              alt="Logo"
              className="h-8 sm:h-10 w-auto"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                BeGods <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </h1>
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <div className="flex gap-1">
                  BY
                  <p className="text-gray-300 font-semibold">FROGDOG GAMES</p>
                </div>
                <div className="flex gap-1">
                  LAUNCHED
                  <p className="text-gray-300 font-semibold">OCTOBER 2025</p>
                </div>
                <div className="flex gap-1">
                  SEASON
                  <p className="text-gray-300 font-semibold">STONE AGE</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm">
            <div className="flex gap-4 w-full sm:w-auto justify-between">
              <div className="text-center sm:text-right">
                <div className="text-gray-400">ITEMS</div>
                <div className="font-semibold">999</div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-gray-400">MINTED</div>
                <div className="font-semibold">{currentNFTData.length}</div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
              <button className="relative overflow-hidden group bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 hover:from-indigo-500 hover:via-purple-500 hover:to-blue-600 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                  <div className="sparkle sparkle-1"></div>
                  <div className="sparkle sparkle-2"></div>
                  <div className="sparkle sparkle-3"></div>
                  <div className="sparkle sparkle-4"></div>
                  <div className="sparkle sparkle-5"></div>
                  <div className="sparkle sparkle-6"></div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="sparkle-hover sparkle-hover-1"></div>
                  <div className="sparkle-hover sparkle-hover-2"></div>
                  <div className="sparkle-hover sparkle-hover-3"></div>
                  <div className="sparkle-hover sparkle-hover-4"></div>
                  <div className="sparkle-hover sparkle-hover-5"></div>
                  <div className="sparkle-hover sparkle-hover-6"></div>
                  <div className="sparkle-hover sparkle-hover-7"></div>
                  <div className="sparkle-hover sparkle-hover-8"></div>
                </div>
                <span className="relative z-10 flex items-center gap-2">
                  <Gamepad2 size={22} /> Play
                </span>
              </button>

              <button
                onClick={() => setShowNFTUpgrade(true)}
                className="relative overflow-hidden group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
              >
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                  <div className="sparkle sparkle-1"></div>
                  <div className="sparkle sparkle-2"></div>
                  <div className="sparkle sparkle-3"></div>
                  <div className="sparkle sparkle-4"></div>
                  <div className="sparkle sparkle-5"></div>
                  <div className="sparkle sparkle-6"></div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="sparkle-hover sparkle-hover-1"></div>
                  <div className="sparkle-hover sparkle-hover-2"></div>
                  <div className="sparkle-hover sparkle-hover-3"></div>
                  <div className="sparkle-hover sparkle-hover-4"></div>
                  <div className="sparkle-hover sparkle-hover-5"></div>
                  <div className="sparkle-hover sparkle-hover-6"></div>
                  <div className="sparkle-hover sparkle-hover-7"></div>
                  <div className="sparkle-hover sparkle-hover-8"></div>
                </div>
                <span className="relative z-10 flex items-center gap-2">
                  <CircleFadingArrowUp size={22} /> Upgrade NFT
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="max-w-7xl mx-auto py-2 px-3 sm:px-0">
        <h2 className="uppercase text-sm tracking-wider text-gray-400 py-4">
          Collections
        </h2>
        <div className="flex gap-3 flex-wrap">
          {collections.map((item, index) => {
            const isActive = activeCollection === index;
            const currentData = collectionNFTData[item.collectionId];

            return (
              <div
                key={item.id}
                onClick={() => handleCollectionChange(index)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "border border-gray-500 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 shadow-md"
                    : "border border-gray-700 hover:border-gray-500 hover:scale-105"
                }`}
              >
                <img
                  src={`/${item.id}.png`}
                  alt={`${item.id} collection`}
                  className="w-7 h-7 rounded-md"
                />
                <span
                  className={`text-sm ${
                    isActive ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* NFTs Section */}
      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-3 sm:px-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm tracking-wider text-gray-400">
            {collections[activeCollection] &&
              `${collections[activeCollection].name}`}{" "}
            NFTs
          </h2>
          <div className="text-sm text-gray-400">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
          </div>
        </div>

        <div className="flex flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* <Filter /> */}
          <div className="flex items-center border border-gray-700 rounded-lg overflow-x-auto sm:overflow-visible">
            <button
              className={`p-2 ${viewMode === "grid" ? "bg-gray-700" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              className={`p-2 ${viewMode === "large" ? "bg-gray-700" : ""}`}
              onClick={() => setViewMode("large")}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-1">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Loading state for NFTs */}
        {paginationInfo.loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* NFT Grid */}
        <div className={`w-full grid gap-4 ${getGridClasses()}`}>
          {currentNFTData.map((nft, index) => (
            <NFTCard
              key={`${nft.collectionId}-${nft.index}-${index}`}
              nft={nft}
              viewMode={viewMode}
              openModal={openModal}
            />
          ))}
        </div>

        {/* No NFTs message */}
        {!paginationInfo.loading && currentNFTData.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No NFTs found in this collection
          </div>
        )}

        {/* Pagination Controls */}
        {paginationInfo.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={goToPrevPage}
              disabled={
                paginationInfo.currentPage <= 1 || paginationInfo.loading
              }
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>

            <span className="text-sm text-gray-400">
              {paginationInfo.currentPage} / {paginationInfo.totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={
                paginationInfo.currentPage >= paginationInfo.totalPages ||
                paginationInfo.loading
              }
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Load More Button (Alternative to pagination) */}
        {paginationInfo.currentPage < paginationInfo.totalPages && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMoreNFTs}
              disabled={paginationInfo.loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {paginationInfo.loading ? "Loading..." : "Load More NFTs"}
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <NFTModal
        nft={selectedNFT}
        isOpen={isModalOpen}
        onClose={closeModal}
        updateNFTFavorite={(collectionId, tokenId, isFav) =>
          updateNFTFavorite(collectionId, tokenId, isFav)
        }
      />
      {showNFTUpgrade && (
        <NFTUpgradeModal onClose={() => setShowNFTUpgrade(false)} />
      )}
    </div>
  );
};

export default Collection;
