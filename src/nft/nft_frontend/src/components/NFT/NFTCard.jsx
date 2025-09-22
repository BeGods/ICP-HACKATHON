import { Heart } from "lucide-react";

const NFTCard = ({ nft, viewMode, openModal }) => {
  const textSize = viewMode === "small" ? "text-xs" : "text-sm";
  const priceSize = viewMode === "small" ? "text-sm" : "text-base sm:text-lg";

  return (
    <div
      onClick={() => openModal(nft)}
      className="bg-gray-900 cursor-pointer rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
    >
      <div className={`relative  aspect-square group`}>
        <img
          src={nft.faceImg}
          alt="card"
          className="w-full h-full object-cover"
        />

        {nft.isFav && (
          <div className="absolute top-2 right-2 flex gap-2 bg-black/50 rounded-full p-2 hover:bg-black/70">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </div>
        )}
      </div>

      <div className={`px-4 py-3 ${viewMode !== "grid" && "hidden"}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-white font-medium ${textSize}`}>{nft.name}</h3>
          <span className="text-gray-400 font-medium uppercase text-xs">
            {nft.rarity}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-white font-semibold ${priceSize}`}>
            {nft.price} ICP
          </span>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
