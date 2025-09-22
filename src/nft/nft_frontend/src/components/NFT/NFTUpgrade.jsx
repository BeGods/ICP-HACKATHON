import { useEffect, useState } from "react";
import {
  X,
  ArrowUp,
  Flame,
  Sparkles,
  Crown,
  Star,
  Award,
  ChevronRight,
} from "lucide-react";
import NFTReveal from "./NFTReveal";
import { useAuth } from "../../utils/useAuthClient";
import { toast } from "react-toastify";

const NFTUpgradeModal = ({ onClose }) => {
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { backendActor, principal, isAuthenticated } = useAuth({});
  const [userNFTs, setUserNFTs] = useState([]);
  const [showNFTReveal, setShowNFTReveal] = useState(null);

  const rarities = ["common", "uncommon", "rare", "mythical", "divine"];

  const getNextRarity = (currentRarity) => {
    const currentIndex = rarities.indexOf(currentRarity.toLowerCase());
    if (currentIndex === -1 || currentIndex === rarities.length - 1) {
      return null;
    }
    return rarities[currentIndex + 1];
  };

  const fetchUserNFTs = async () => {
    try {
      const result = await backendActor.userNFTsAllCollections(
        principal,
        99,
        0
      );

      const listedNfts = result?.ok?.boughtNFTs || [];

      const groupedNFTs = {};

      listedNfts.forEach((eachItem) => {
        const tokenId = eachItem[0];
        const collection = eachItem[3];
        const collectionId = eachItem[4];
        const { nonfungible } = eachItem[2];
        const { thumbnail: image, name, description } = nonfungible;
        const metadata = JSON.parse(nonfungible.metadata[0].json);
        const {
          nftType,
          chain,
          arstistname,
          nftSeason,
          standard,
          nftFullImage,
        } = metadata;
        const rarity = nftType;

        const key = `${name}_${rarity}`;

        if (!groupedNFTs[key]) {
          const nextRarity = getNextRarity(rarity);

          groupedNFTs[key] = {
            id: key,
            faceImg: image,
            description,
            cardImg: nftFullImage,
            tokenIds: [tokenId],
            count: 1,
            name,
            nftType,
            rarity,
            nextRarity: nextRarity,
            possibleUpgrades: 0,
            canUpgrade: false,
            chain,
            arstistname,
            nftSeason,
            standard,
            collection,
            collCanister: collectionId,
          };
        } else {
          groupedNFTs[key].tokenIds.push(tokenId);
          groupedNFTs[key].count += 1;
          groupedNFTs[key].possibleUpgrades = Math.floor(
            groupedNFTs[key].count / 3
          );
          groupedNFTs[key].canUpgrade = groupedNFTs[key].count >= 3;
        }
      });

      const updatedNFTData = Object.values(groupedNFTs);

      setUserNFTs(updatedNFTData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch NFTs");
    }
  };

  const handleUpgradeNFT = async () => {
    setIsUpgrading(true);

    try {
      if (
        !selectedUpgrade ||
        !selectedUpgrade.possibleUpgrades ||
        selectedUpgrade.possibleUpgrades < 0
      ) {
        toast.error("Please select appropriate NFTs to upgrade");
        return;
      }

      const result = await backendActor.upgradeNFTRarity(
        selectedUpgrade.collCanister,
        selectedUpgrade.tokenIds.slice(0, 3)
      );

      console.log("✅ Upgrade successful! New Token ID:", result);
      toast.success(`Upgrade successful! New NFT: ${result}`);
      setShowNFTReveal(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpgrading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      (async () => await fetchUserNFTs())();
    }
  }, []);

  const getRarityIcon = (rarity) => {
    if (!rarity) return <Award className="w-4 h-4 text-gray-400" />;

    switch (rarity.toLowerCase()) {
      case "divine":
        return <Crown className="w-4 h-4 text-purple-400" />;
      case "mythical":
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case "rare":
        return <Sparkles className="w-4 h-4 text-red-400" />;
      case "uncommon":
        return <Star className="w-4 h-4 text-blue-400" />;
      case "common":
        return <Award className="w-4 h-4 text-yellow-400" />;
      default:
        return <Award className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRarityColor = (rarity) => {
    if (!rarity) return "text-gray-400";

    switch (rarity.toLowerCase()) {
      case "divine":
        return "text-purple-400";
      case "mythical":
        return "text-pink-400";
      case "rare":
        return "text-red-400";
      case "uncommon":
        return "text-blue-400";
      case "common":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      {showNFTReveal ? (
        <NFTReveal
          cardImg={selectedUpgrade.cardImg}
          tokenId={showNFTReveal}
          handleClose={() => {
            setSelectedUpgrade(null);
            setShowNFTReveal(null);
            onClose();
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-2 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src="https://media.publit.io/file/BeGods/logos/battle.gods.black.svg"
                  alt="Logo"
                  className="h-8 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    Upgrade NFTs
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Burn 3 NFTs to forge a higher rarity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {!selectedUpgrade ? (
              <div className="p-6">
                {userNFTs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ArrowUp className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                      No Upgrades Available
                    </h3>
                    <p className="text-gray-500">
                      Collect NFTs to upgrade to higher rarities
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-6">
                      Select NFTs to Upgrade
                    </h2>
                    <div className="grid gap-4 sm:gap-6">
                      {userNFTs.map((upgrade, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            if (
                              upgrade.possibleUpgrades &&
                              upgrade.possibleUpgrades > 0 &&
                              upgrade.nextRarity
                            ) {
                              setSelectedUpgrade(upgrade);
                            }
                          }}
                          className={`bg-gray-800 ${
                            (!upgrade.possibleUpgrades ||
                              upgrade.possibleUpgrades < 1 ||
                              !upgrade.nextRarity) &&
                            "grayscale"
                          } border border-gray-700 hover:border-gray-600 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:shadow-lg`}
                        >
                          <div className="flex items-center gap-6">
                            <img
                              src={upgrade.cardImg}
                              alt="card"
                              className="aspect-[360/504] w-28"
                            />

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-1">
                                    {upgrade.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mb-2">
                                    {getRarityIcon(upgrade.rarity)}
                                    <span
                                      className={`font-medium text-sm uppercase ${getRarityColor(
                                        upgrade.rarity
                                      )}`}
                                    >
                                      {upgrade.rarity}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400 text-sm">
                                      {upgrade.collection}
                                    </span>
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    You have{" "}
                                    <span className="text-white font-medium">
                                      {upgrade.count}
                                    </span>{" "}
                                    NFTs • Can make{" "}
                                    <span className="text-green-400 font-medium">
                                      {upgrade.possibleUpgrades}
                                    </span>{" "}
                                    upgrade
                                    {upgrade.possibleUpgrades !== 1 ? "s" : ""}
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </div>

                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-500">
                                  Upgrade to:
                                </span>
                                {upgrade.nextRarity ? (
                                  <div className="flex items-center gap-2">
                                    {getRarityIcon(upgrade.nextRarity)}
                                    <span
                                      className={`font-medium uppercase ${getRarityColor(
                                        upgrade.nextRarity
                                      )}`}
                                    >
                                      {upgrade.nextRarity}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500 italic">
                                    Max rarity reached
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedUpgrade(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                  </button>
                  <h2 className="text-lg font-semibold text-white">
                    Confirm Upgrade
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-center font-medium text-gray-300 mb-4">
                      Burn 3 NFTs
                    </h3>
                    <div
                      className={`relative overflow-hidden mx-auto max-w-48`}
                    >
                      <img
                        src={selectedUpgrade.cardImg}
                        alt="card"
                        className="aspect-[360/504]"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="font-semibold text-white">
                        {selectedUpgrade.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2">
                        {getRarityIcon(selectedUpgrade.rarity)}
                        <span
                          className={`font-medium text-sm uppercase ${getRarityColor(
                            selectedUpgrade.rarity
                          )}`}
                        >
                          {selectedUpgrade.rarity}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        {selectedUpgrade.tokenIds
                          .slice(0, 3)
                          .map((id, index) => (
                            <div
                              key={index}
                              className="text-gray-400 font-mono"
                            >
                              {id.slice(0, 4)}....{id.slice(-4)}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-center font-medium text-gray-300 mb-4">
                      Receive 1 NFT
                    </h3>
                    <div
                      className={` aspect-[3/4] rounded-xl relative overflow-hidden mx-auto max-w-48 ${
                        isUpgrading ? "" : "grayscale opacity-50"
                      } transition-all duration-500`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={selectedUpgrade.cardImg}
                          alt="card"
                          className="aspect-[360/504]"
                        />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="font-semibold text-white">
                        {selectedUpgrade.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2">
                        {getRarityIcon(selectedUpgrade.nextRarity)}
                        <span
                          className={`font-medium text-sm uppercase ${getRarityColor(
                            selectedUpgrade.nextRarity
                          )}`}
                        >
                          {selectedUpgrade.nextRarity}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        From {selectedUpgrade.collection} Collection
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleUpgradeNFT}
                    disabled={isUpgrading}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                      isUpgrading
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg hover:shadow-orange-500/30"
                    }`}
                  >
                    {isUpgrading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Forging...
                      </>
                    ) : (
                      <>
                        <Flame className="w-5 h-5" />
                        Forge Upgrade
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-orange-900/20 border border-orange-800/30 rounded-lg">
                  <p className="text-orange-200 text-sm text-center">
                    <strong>Warning:</strong> This action will permanently burn
                    the selected NFTs. This cannot be undone.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NFTUpgradeModal;
