import { RxCross2 } from "react-icons/rx";
const NftCardItem = (props) => {
    const {deleteNft} = props;
    const {nftDetails} = props
    const {nftImage,nftId,nftName,nftType,nftQuantity,nftPrice,nftDescription} = nftDetails;
    console.log("image" , nftImage);
    console.log("nft card");
    return (
        <div className="relative w-[100%] md:w-[48%] h-[80px] md:h-[120px] mx-1 border mb-4 border-[#FCD37B] border-solid flex rounded-tl-lg rounded-bl-md text-white items-center" style={{fontFamily:'Quicksand'}}>
            <img 
              src={nftImage} 
              alt="Selected" 
              className="absolute w-[20%] h-[102%] object-cover rounded-lg mr-3 top-[-1px] left-[-1px] "
            />
            <div className="absolute p-2 left-[20%] ">
                <h2 className="text-xm lg:text-sm font-medium mb-[0.5px] ">{nftName}</h2>
                <h2 className="text-sm font-medium mb-[0.5px] ">TYPE : {nftType}</h2>
                <div className="flex justify-between items-center mb-[0.5px] ">
                    <h2 className="text-sm font-medium">Quantity : {nftQuantity}</h2>
                    <h2 className="text-sm font-medium pr-3">Price - {nftPrice} ICP</h2>
                </div>
                <p className="text-sm">{nftDescription}</p>
            </div>
            <button
              className="absolute top-0 right-0 bg-white rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
              onClick={(e) => deleteNft(nftId)}
            >
              <RxCross2 className="text-black" size={15} />
            </button>
          </div>
        
    )
}
export default NftCardItem;