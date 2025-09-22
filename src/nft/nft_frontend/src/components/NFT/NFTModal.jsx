import { ChevronRight, X, Share2, Award, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/useAuthClient";
import NFTBtn from "./NFTBtn";
import NFTReveal from "./NFTReveal";

const NFTModal = ({
  nft,
  isOpen,
  onClose,
  updateNFTFavorite,
  triggerChange,
}) => {
  const { backendActor, principal } = useAuth();
  const [showNFTReveal, setShowNFTReveal] = useState(false);
  const [localFav, setLocalFav] = useState(false);

  console.log(nft);

  useEffect(() => {
    if (nft) {
      setLocalFav(nft.isFav ?? false);
    }
  }, [nft]);

  if (!isOpen || !nft) return null;

  const formatToMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleRemoveFromFav = async () => {
    try {
      const result = await backendActor?.removeFromFavorites(
        principal,
        nft.tokenId
      );
      console.log("Removed:", result?.ok);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToFav = async () => {
    try {
      const result = await backendActor?.addToFavorites(principal, nft.tokenId);
      console.log("Added:", result?.ok);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFav = async () => {
    if (localFav) {
      // remove from fav
      updateNFTFavorite(nft.collectionId, nft.tokenId, false);
      await handleRemoveFromFav();
      setLocalFav(false);
    } else {
      // add to fav
      updateNFTFavorite(nft.collectionId, nft.tokenId, true);
      await handleAddToFav();
      setLocalFav(true);
    }
  };

  return (
    <>
      {showNFTReveal ? (
        <NFTReveal
          cardImg={nft.cardImg}
          tokenId={nft.tokenId}
          handleClose={() => {
            onClose();
            setShowNFTReveal(false);
            triggerChange();
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4 no-scrollbar">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-2 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src="https://media.publit.io/file/BeGods/logos/battle.gods.black.svg"
                  alt="Logo"
                  className="h-8 w-auto"
                />
                <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  BeGods
                </h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div className="relative pb-2 flex justify-center items-center overflow-hidden">
                  <img
                    src={nft.cardImg}
                    alt="card"
                    className="aspect-[360/504] w-60 h-auto"
                  />
                </div>

                <div className="bg-gray-800 flex justify-between items-center p-4 rounded-xl">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">
                      Current Price
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {nft.price} ICP
                    </div>
                  </div>
                  <NFTBtn
                    amount={nft.amount}
                    tokenId={nft.tokenId}
                    collectionId={nft.collectionId}
                    handleRevealNFT={() => {
                      setShowNFTReveal(true);
                    }}
                  />
                </div>

                <div className="bg-gray-800 flex justify-between items-center p-4 cursor-pointer rounded-xl">
                  <div className="flex items-center gap-x-4">
                    <img
                      src={`/${nft.collection.toLowerCase()}.png`}
                      alt={`${nft.collection.toLowerCase()} collection`}
                      className="h-16 w-auto"
                    />
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        Collection
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {nft.collection}
                      </div>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-x-4">
                    <img
                      src={nft.faceImg}
                      alt="Logo"
                      className="h-14 rounded-lg border border-gray-200 w-auto"
                    />
                    <div className="flex flex-col gap-y-1">
                      <div className="text-2xl font-bold text-white">
                        {nft.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 font-medium text-sm uppercase">
                          {nft.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={handleFav}
                      className="p-3 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 hover:text-red-500 ${
                          localFav ? "text-red-500 fill-current" : "text-white"
                        }`}
                      />
                    </button>
                    <button className="p-3 transition-colors">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Artist</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {nft.arstistname}
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {nft.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Owner</span>
                    <span className="text-white font-medium">
                      {principal.slice(0, 4)}....{principal.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Token</span>
                    <span className="text-white font-medium">
                      {nft.tokenId.slice(0, 4)}....{nft.tokenId.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Chain</span>
                    <span className="text-white font-medium">{nft.chain}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Minted</span>
                    <span className="text-white font-medium">
                      {formatToMonthYear(nft.date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Season</span>
                    <span className="text-white font-medium uppercase">
                      {nft.season}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">Token Standard</span>
                    <span className="text-white font-medium">
                      {nft.standard}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTModal;
