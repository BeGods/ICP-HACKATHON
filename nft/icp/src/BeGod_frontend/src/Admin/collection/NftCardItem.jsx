import { RxCross2 } from "react-icons/rx";
import { GrFormEdit } from "react-icons/gr";

const NftCardItem = (props) => {
  const { deleteNft, nftDetails, onClickEdit } = props;
  const {
    nftId,
    nftDescription,
    nftName,
    nftQuantity,
    nftType,
    nftPrice,
    nftImage,
  } = nftDetails;

  return (
    <div className="relative object-cover border-2 border-gray-700 w-full max-w-[28rem] rounded-md p-4">
      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Image Section */}
        <img
          src={nftImage}
          alt="NFT"
          className="object-contain w-full md:w-[40%] h-32 rounded-lg"
        />

        {/* NFT Details Section */}
        <div className="flex flex-col gap-2 w-[50%]">
          <span className="font-bold text-lg truncate">{nftName}</span>
          <span className="font-bold text-md">Type: {nftType}</span>

          <div className="flex flex-col md:flex-row justify-between w-full gap-2">
            <span className="font-bold text-md">Quantity: {nftQuantity}</span>
            <span className="font-bold text-md">Price: {nftPrice} ICP</span>
          </div>

          {/* Truncated description for smaller screens */}
          <span className="font-light text-sm truncate">
            {nftDescription
              ? `${nftDescription.slice(0, 100)}...`
              : "No Description available"}
          </span>
        </div>
      </div>

      {/*Edit Button*/}
      <button
        className="absolute top-2 right-9 flex items-center justify-center w-6 h-6 bg-white rounded-full hover:bg-gray-300 transition duration-150"
        onClick={() => onClickEdit(nftId)}
      >
        <GrFormEdit className="text-black" size={15} />
      </button>
      {/* Delete Button */}
      <button
        className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-white rounded-full hover:bg-gray-300 transition duration-150"
        onClick={() => deleteNft(nftId)}
      >
        <RxCross2 className="text-black" size={15} />
      </button>
    </div>
  );
};

export default NftCardItem;
