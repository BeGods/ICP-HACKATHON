import { RxCross2 } from "react-icons/rx";
const NftCardItem = (props) => {
    const {deleteNft} = props;
    const {nftDetails} = props
    const {nftImage,nftId} = nftDetails;
    console.log("image" , nftImage);
    console.log("nft card");
    return (
        <div className="relative w-[50px] h-[70px] mr-3 ">
            <img 
              src={nftImage} 
              alt="Selected" 
              className="w-full h-full object-cover rounded-lg nft_card_image"
            />
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