import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ImageUpload from "./collection/ImageUpload";
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { RiFolder6Line } from "react-icons/ri";
import ImageUploader from "./collection/ImageUploader";

const Modal = (props) => {
    const {getAddedNftDetails} = props;
    const [nftId, setNftId] = useState("asdadadf232f23");
    const [nftName, setNftName] = useState("Be Gods");
    const [nftType, setNftType] = useState("NORMAL");
    const [nftQuantity, setNftQuantity] = useState("2");
    const [nftPrice, setPrice] = useState("323");
    const [nftDescription, setNftDescription] = useState("This is a rear NFT which will be found.");
    const [nftImage,setNftImage] = useState("");
    const {toggleModal} = props


    const onClickAddButton = (event) => {
        event.preventDefault();
        const nftDetails = {
            nftId,
            nftName,
            nftType,
            nftQuantity,
            nftImage,
            nftPrice,
            nftDescription
        }
        console.log("nft details",nftDetails);
        getAddedNftDetails(nftDetails);
        toggleModal();
    
    }

    const captureUploadedNftImage = (img) => {
        setNftImage(img);
        console.log("img" , img);
    }

    return (
        <div className="nft_popup_bg_container">
            <div className="button_container">
                <button className="cross_mark" onClick={() => toggleModal()}>
                    <RxCross2 size={25} />
                </button>
            </div>
            <form>
                <div>
                    <label className="mt-2 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
                        NFT's ID
                        <input
                            value={nftId}
                            onChange={(e) => setNftId(e.target.value)}
                            type="text"
                            className="mt-1 pl-4 w-[100%] h-[30px] md:h-[30px] bg-[#29292C] rounded-md text-[16px]  text-[#8a8686] "
                        />
                    </label>
                </div>

                <div className="mt-2">
                    <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
                        NFT Name
                        <input
                            value={nftName}
                            onChange={(e) => setNftName(e.target.value)}
                            type="text"
                            className="mt-1 pl-4 w-[100%] h-[30px] md:h-[30px] bg-[#29292C] rounded-md  text-[16px]  text-[#8a8686]"
                        />
                    </label>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-[100%]">
                    <label className="w-full sm:w-1/2 h-16 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
                        Type:
                        <select className="p-1 rounded-md md:h-[30px] bg-[#29292C] mt-0 md:text-[16px  text-[16px]  text-[#8a8686]" value={nftType} onChange={(e)=>setNftType(e.target.value)}>
                            <option value="NORMAL" className="md:h-[30px]  text-[16px]  text-[#8a8686]">Normal</option>
                            <option value="TEST" className="md:h-[30px]  text-[16px]  text-[#8a8686]">Test Option</option>
                        </select>
                    </label>
                    <label className="w-full sm:w-1/2 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
                        Quantity:
                        <input
                            value={nftQuantity}
                            onChange={(e) => setNftQuantity(e.target.value)}
                            type="text"
                            className="pl-4 rounded-md md:h-[30px] bg-[#29292C] mt-0  text-[16px]  text-[#8a8686]"
                        />
                    </label>
                </div>

                <div className="mt-0">
                    <label className="mt-[20px] w-[100%] h-[30px] md:h-[86px] text-[#FFFFFF] gap-0 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
                            Image
                            <ImageUploader captureUploadedNftImage={captureUploadedNftImage}/>
                    </label>
                </div>

                <div className="mt-2">
                    <label className="mt-[20px] w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
                        Price
                        <input
                            value={nftPrice}
                            onChange={(e) => setPrice(e.target.value)}
                            type="text"
                            className="pl-4 w-[100%] h-[30px] md:h-[30px] bg-[#29292C] rounded-md text-[16px]  text-[#8a8686] "
                        />
                    </label>
                </div>

                <div className="mt-2">
                    <label className="w-[100%] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
                        NFT's Description
                        <textarea
                            value={nftDescription}
                            onChange={(e) => setNftDescription(e.target.value)}
                            type="textarea"
                            rows={3}
                            className="pl-2 w-[100%] h-[30px]  bg-[#29292C] rounded-md mt-1 nft_description  text-[16px]  text-[#8a8686] "
                        ></textarea>
                    </label>
                </div>
        <div className="mt-1 md:mt-2 flex justify-center">
            <button type="submit" className="add_button" onClick={onClickAddButton}>ADD</button>
        </div>
               
            </form>
        </div>
    );
};

export default Modal;
