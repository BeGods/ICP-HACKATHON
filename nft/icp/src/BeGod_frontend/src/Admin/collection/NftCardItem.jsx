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
    <div className="relative object-cover border-2 border-gray-700 w-[28rem] rounded-md">
      <div className="flex w-full gap-4 p-4">
        <img
          src={nftImage}
          alt="Selected"
          className="object-cover w-32 rounded-lg h-42 nft_card_image"
        />
        <div className="flex flex-col gap-2">
          <span className="font-bold">{nftName}</span>
          <span className="font-bold">Type: {nftType}</span>
          <div className="flex flex-row justify-between w-full gap-2">
            <span className="font-bold">Quantity: {nftQuantity}</span>
            <span className="font-bold">Price: {nftPrice} ICP</span>
          </div>

          <span className="font-light">{nftDescription}</span>
        </div>
      </div>
      <button
        className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
        onClick={(e) => deleteNft(nftId)}
      >
        <RxCross2 className="text-black" size={15} />
      </button>
    </div>
  );
};
export default NftCardItem;
