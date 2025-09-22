import {
  Copy,
  Clock,
  Heart,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import NFTCard from "../../components/NFT/NFTCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuthClient";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 9;

const TransactionTable = ({
  transactions,
  currentPage,
  onPageChange,
  totalPages,
}) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return (
      new Date(date).toLocaleDateString() +
      " " +
      new Date(date).toLocaleTimeString()
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-gray-400 text-lg mb-2">No transactions yet</h3>
        <p className="text-gray-500 text-sm">
          Your transaction history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-900 rounded-lg border border-gray-800">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 font-medium text-gray-400">
                Collection
              </th>
              <th className="text-left p-4 font-medium text-gray-400">
                Token ID
              </th>
              <th className="text-left p-4 font-medium text-gray-400">
                Price (ICP)
              </th>
              <th className="text-left p-4 font-medium text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-4 text-gray-300">{tx.collectionName}</td>
                <td className="p-4 text-gray-300 font-mono">#{tx.tokenId}</td>
                <td className="p-4">
                  <span className={`font-bold`}>
                    {tx.price ? tx.price.toFixed(4) : "0.0000"}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {formatDate(tx.time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const Profile = (props) => {
  const [activeTab, setActiveTab] = useState("nfts");
  const [copied, setCopied] = useState(false);
  const { backendActor, isAuthenticated, principal, logout } = useAuth({});

  const [userNFTs, setUserNFTs] = useState([]);
  const [nftCurrentPage, setNftCurrentPage] = useState(1);
  const [nftTotalPages, setNftTotalPages] = useState(1);
  const [nftLoading, setNftLoading] = useState(false);

  const [activityList, updateActivityList] = useState([]);
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [activityLoading, setActivityLoading] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [favCurrentPage, setFavCurrentPage] = useState(1);
  const favTotalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);

  const navigate = useNavigate();
  const walletAddress = `${principal.slice(0, 4)}....${principal.slice(-4)}`;
  const fullAddress = principal;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchUserNFTs = async (page = 1) => {
    try {
      setNftLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const result = await backendActor.userNFTsAllCollections(
        principal,
        ITEMS_PER_PAGE,
        offset
      );

      const listedNfts = result?.ok?.boughtNFTs || [];
      const totalPages = parseInt(result?.ok?.total_pages) || 1;

      setNftTotalPages(totalPages);

      const updatedNFTData = listedNfts.map((eachItem, index) => {
        const tokenId = eachItem[0];
        const { nonfungible } = eachItem[2];
        const { thumbnail: image, name, description } = nonfungible;
        const metadata = JSON.parse(nonfungible.metadata[0].json);
        const { nftType, chain, date, arstistname, nftSeason, standard } =
          metadata;

        const nftCard = {
          id: `#${offset + index}`,
          index: offset + index,
          faceImg: image,
          description: description,
          cardImg: metadata.nftFullImage,
          tokenId,
          name,
          nftType,
          rarity: metadata.nftType || "Common",
          season: metadata.season || "Stone Age",
          chain,
          date,
          arstistname,
          nftSeason,
          standard,
        };

        return nftCard;
      });

      setUserNFTs(updatedNFTData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch NFTs");
    } finally {
      setNftLoading(false);
    }
  };

  const fetchUserActivity = async (page = 1) => {
    try {
      setActivityLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const result = await backendActor?.alluseractivity(
        principal,
        ITEMS_PER_PAGE,
        offset
      );

      const totalPages = result?.ok?.total_pages || 1;
      setActivityTotalPages(totalPages);

      const allActivities =
        result?.ok?.data?.map((eachItem) => {
          const timeInMilliSeconds = Number(eachItem[2].time) / 1000000;
          return {
            collectionName: eachItem[3],
            tokenId: eachItem[1],
            price: Number(eachItem[2].price) / 100000000,
            time: new Date(timeInMilliSeconds),
            buyStatus: eachItem[4],
          };
        }) || [];

      updateActivityList(allActivities);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      toast.error("Failed to fetch activity");
    } finally {
      setActivityLoading(false);
    }
  };

  const fetchFavoriteCards = async () => {
    const result = await backendActor?.getFavoritesWithMetadata(principal);
    const listedNfts = result?.ok || [];

    const updatedNFTData = listedNfts.map((eachItem, index) => {
      const tokenId = eachItem[1];
      const { nonfungible } = eachItem[3];
      const { thumbnail: image, name, description } = nonfungible;
      const metadata = JSON.parse(nonfungible.metadata[0].json);
      const { nftType, chain, date, arstistname, nftSeason, standard } =
        metadata;

      const nftCard = {
        id: `#${index}`,
        index: index,
        faceImg: image,
        description: description,
        cardImg: metadata.nftFullImage,
        tokenId,
        name,
        nftType,
        rarity: metadata.rarity || "Common",
        season: metadata.season || "Stone Age",
        chain,
        date,
        arstistname,
        nftSeason,
        standard,
      };

      return nftCard;
    });

    setFavorites(updatedNFTData);
  };
  const handleNftPageChange = (page) => {
    setNftCurrentPage(page);
    fetchUserNFTs(page);
  };

  const handleActivityPageChange = (page) => {
    setActivityCurrentPage(page);
    fetchUserActivity(page);
  };

  const handleFavPageChange = (page) => {
    setFavCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    switch (tab) {
      case "nfts":
        if (userNFTs.length === 0) {
          setNftCurrentPage(1);
          fetchUserNFTs(1);
        }
        break;
      case "transactions":
        if (activityList.length === 0) {
          setActivityCurrentPage(1);
          fetchUserActivity(1);
        }
        break;
      case "favorites":
        setFavCurrentPage(1);
        break;
    }
  };

  const paginatedFavorites = favorites.slice(
    (favCurrentPage - 1) * ITEMS_PER_PAGE,
    favCurrentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to access profile page.");
    } else {
      fetchUserNFTs(1);
      fetchUserActivity(1);
      fetchFavoriteCards();
    }
  }, []);

  const onClickLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-[#161616] text-white font-mono">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-[8dvh] w-full">
        <div className="flex items-center gap-3 mb-8 w-full">
          <div className="bg-gray-700 w-16 h-16 rounded-lg relative flex-shrink-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg">
                <User />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Profile
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 font-mono text-sm sm:text-base">
                  {walletAddress}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                  title="Copy full address"
                >
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={onClickLogout}
                className="bg-white text-black py-2 px-4 h-fit rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-800 mb-6">
          <button
            onClick={() => handleTabChange("nfts")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "nfts"
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Clock className="w-4 h-4 inline-block mr-2" />
            My NFTs ({userNFTs.length})
          </button>
          <button
            onClick={() => handleTabChange("favorites")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "favorites"
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Heart className="w-4 h-4 inline-block mr-2" />
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => handleTabChange("transactions")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "transactions"
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Clock className="w-4 h-4 inline-block mr-2" />
            Activity ({activityList.length})
          </button>
        </div>

        {activeTab === "nfts" && (
          <div>
            {nftLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading NFTs...</p>
              </div>
            ) : userNFTs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg mb-2">
                  No NFTs collected yet
                </h3>
                <p className="text-gray-500 text-sm">
                  NFTs you collected will appear here
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userNFTs.map((nft, index) => (
                    <NFTCard
                      key={index}
                      nft={nft}
                      viewMode={"grid"}
                      openModal={() => {}}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={nftCurrentPage}
                  totalPages={nftTotalPages}
                  onPageChange={handleNftPageChange}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            {activityLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading transactions...</p>
              </div>
            ) : (
              <TransactionTable
                transactions={activityList}
                currentPage={activityCurrentPage}
                onPageChange={handleActivityPageChange}
                totalPages={activityTotalPages}
              />
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg mb-2">No favorites yet</h3>
                <p className="text-gray-500 text-sm">
                  NFTs you like will appear here
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedFavorites.map((nft, index) => (
                    <NFTCard
                      key={index}
                      nft={nft}
                      viewMode={"grid"}
                      openModal={() => {}}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={favCurrentPage}
                  totalPages={favTotalPages}
                  onPageChange={handleFavPageChange}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
