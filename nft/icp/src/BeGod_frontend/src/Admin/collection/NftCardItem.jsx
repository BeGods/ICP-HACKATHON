import { RxCross2 } from "react-icons/rx";
const NftCardItem = (props) => {
  const { deleteNft } = props;
  const { nftDetails } = props;
  const {
    nftImageUrl,
    nftId,
    nftDescription,
    nftName,
    nftQuantity,
    nftType,
    nftPrice,
    nftImage,
  } = nftDetails;
  console.log(nftDetails, "hello dddddd");

  return (
    <div className="relative object-cover border-2 border-gray-700 w-full max-w-[28rem] rounded-md">
      <div className="flex flex-col md:flex-row w-full gap-4 p-4">
        <img
          src={nftImage}
          alt="Selected"
          className="object-cover w-32 h-32 rounded-lg nft_card_image"
        />
        <div className="flex flex-col gap-2 w-full">
          <span className="font-bold text-lg">{nftName}</span>
          <span className="font-bold text-md">Type: {nftType}</span>
          <div className="flex flex-row justify-between w-full gap-2">
            <span className="font-bold text-md">Quantity: {nftQuantity}</span>
            <span className="font-bold text-md">Price: {nftPrice} ICP</span>
          </div>
          <span className="font-light text-sm">
            {nftDescription
              ? `${nftDescription.slice(0, 150)}...`
              : "No Description available"}
          </span>
        </div>
      </div>
      <button
        className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 transform bg-white rounded-full hover:bg-gray-300 transition duration-150"
        onClick={(e) => deleteNft(nftId)}
      >
        <RxCross2 className="text-black" size={15} />
      </button>
    </div>
  );
};
export default NftCardItem;
