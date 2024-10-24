import React, { useEffect, useState } from 'react';
import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import NftCard from '../components/NftCard';
import { Link } from 'react-router-dom';
import YellowButton from '../components/button/YellowButton';
import { useAuth } from '../utils/useAuthClient';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ImageUploader from '../Admin/collection/ImageUploader';
import { RxCross2 } from "react-icons/rx";
import { Principal } from "@dfinity/principal";
import { BiCategory } from "react-icons/bi";
import { IoCheckmarkOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import MoonLoader from "react-spinners/MoonLoader";
import { v4 as uuidv4 } from 'uuid';

import { City, Country } from 'country-state-city'; 

import { FaTelegram } from "react-icons/fa6";
import { RiFileCopyLine } from 'react-icons/ri';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FadeLoader from "react-spinners/FadeLoader"
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { updateCurrentIndex } from '../redux/infoSlice';
import { LiaSearchSolid } from "react-icons/lia";

const buyingStatus = {
   initial : "INITIAL",
   deliveryInfo : "DELIVERYINFO",
   showCollection : "COLLECTION",
   placeOrderStatus : "ORDERSTATUS"
}

const Profile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardsLoading,setIsCardsLoading] = useState(true);
  const [noCards,updateNoCardsStatus] = useState(false);

  const [selectedList , updateSelectedList] = useState([]);
  const [currentOption,updateCurrentOption] = useState("mycollection");

  const allCollectionsList = useSelector((state)=> state.info.collectionList);

  console.log("all collection list in profile",allCollectionsList)

  const [favIds,setFavIds] = useState(undefined);
  
  const { principal } = useAuth();

  const [isUserDetailsLoadging,updateUserDetailsLoading] = useState(true);

  const [isDisplayCollectionDropDown , updateDropDownStatus] = useState(false);
  const navigate = useNavigate(); 
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [remainingNftsCount,updateRemainingNfts] = useState([]);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false); 

  const [searchInput,updateSearchInput] = useState("");


  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/')
     }else{
      console.log(principal,'principal')
     }
  },[isAuthenticated]);

  const dispatch = useDispatch();
 useEffect(()=>{
  dispatch(updateCurrentIndex(0));
 })


const [placeOrderPopup , setplaceOrderPopup] = useState(false);
const [currentOrderingStatus , updateOrderingStatus] = useState(buyingStatus.showCollection);
const [selectedCountry , updateSelectedCountry] = useState("")
const [selectedCity , updateSelectedCity] = useState("");
const [phoneNo , updatePhoneNumber] = useState(NaN);
const [orderEmail,updateOrderEmail] = useState("");
const [streetAddress,updateStreetAddress] = useState('');
const [pinCode , updatePinCode] = useState(NaN);
const [landMark,updateLandMark] = useState("");
const [placeOrderLoading , updatePlaceOrderLoading] = useState(false);
const [orderMsg,updateOrderMsg] = useState("");
const [isOrderPlaced,updateOrderPlacedStatus] = useState(false);

const [orderId,updateOrderId] = useState(NaN)
const countries = Country.getAllCountries().map((eachCountry) => ({
  id : eachCountry.isoCode,
  displayText : eachCountry.name,
}));

const [cityList,updateCityList] = useState([]);



const togglePlaceOrderPopup  = () => {
  setplaceOrderPopup(!placeOrderPopup);
  updateOrderingStatus(buyingStatus.showCollection);
  updateOrderPlacedStatus(false);
}

const onChangeCoutry = (event) => {
  console.log(event.target.value);
  const cities = City.getCitiesOfCountry(event.target.value);
  updateCityList(cities);
  updateSelectedCountry(event.target.value)
}

const onChangeCity = (event) => {
  if(cityList.length != 0){
      updateSelectedCity(event.target.value)
  }
}

const resetFormFields = () => {
  updateSelectedCountry("");
  updateSelectedCity("");
  updatePhoneNumber(NaN);
  updateOrderEmail("");
  updateStreetAddress("");
  updatePinCode(NaN);
  updateLandMark("");
};

const onClickOrder = async (orderType) => {
  // Check if all fields are empty
  const isFormValid = 
  !selectedCountry &&
  !selectedCity &&
  !streetAddress &&
  !orderEmail &&
  (isNaN(phoneNo) || phoneNo === "") && // Check if phoneNo is NaN or empty
  (isNaN(pinCode) || pinCode === "")    
  if (
    isFormValid
  ) {
    toast.error("Please fill out all the fields.");
    return;
  }

  // Validate phone number first
  if (phoneNo.toString().trim() === "" || isNaN(phoneNo)) {
    toast.error("Please enter a valid phone number.");
    return;
  }

  // Validate email next
  if (
    orderEmail.trim() === "" ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(orderEmail)
  ) {
    toast.error("Please enter a valid email address.");
    return;
  }

  // Validate street address
  if (streetAddress.trim() === "") {
    toast.error("Please enter a street address.");
    return;
  }

  // Validate city
  if (selectedCity.trim() === "") {
    toast.error("Please select a city.");
    return;
  }

  // Validate country
  if (selectedCountry.trim() === "") {
    toast.error("Please select a country.");
    return;
  }

  // Validate pin code
  if (pinCode.toString().trim() === "" || pinCode.toString().length !== 6) {
    toast.error("Please enter a valid 6-digit pin code.");
    return;
  }

  // If all validations pass, proceed to place the order
  try {
    if(orderType === "placeorder"){
      updatePlaceOrderLoading(true);
    updateOrderingStatus(buyingStatus.placeOrderStatus);
    console.log("landmark before sending",landMark);
    const validLandMark = landMark != "" ? [landMark] : []
    const result = await backendActor.gethardcopy(
      Principal.fromText(principal),
      uuidv4(),
      allCollectionsList[currentDropDownOption].collectionId,
      phoneNo.toString(),
      orderEmail,
      streetAddress,
      selectedCity,
      selectedCountry,
      pinCode.toString(),
      validLandMark,
    );




        if (result.ok) {
          updateOrderMsg("Order Placed Successfully!")
          resetFormFields();
          fetchOrderHistory();
        } else {
          updateOrderMsg(result.err);
        }
    }else{
      updatePlaceOrderLoading(true);
    updateOrderingStatus(buyingStatus.placeOrderStatus);
    console.log("order id",orderId);
    const validLandMark = landMark != "" ? [landMark] : []
    const result = await backendActor.updateOrder(
      Principal.fromText(principal),
      parseInt(orderId),
      phoneNo.toString(),
      orderEmail,
      streetAddress,
      selectedCity,
      selectedCountry,
      pinCode.toString(),
      validLandMark,
    );

    console.log("result of update order",result);


    if (result.ok) {
      updateOrderMsg("Order Updated Successfully!");
      await fetchOrderHistory();
      resetFormFields();
    } else {
      updateOrderMsg(result.err);
    }
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while placing the order.");
  }
  finally{
    updatePlaceOrderLoading(false);
  }
};


const onClickRemoveOrder = async () =>{
  updatePlaceOrderLoading(true);
  updateOrderingStatus(buyingStatus.placeOrderStatus);
  const result = await backendActor?.removeOrder(Principal.fromText(principal),parseInt(orderId));
  if (result.ok) {
    updateOrderMsg("Order Removed Successfully!");
    await fetchOrderHistory();
    resetFormFields()
  } else {
    updateOrderMsg(result.err);
  }
  updatePlaceOrderLoading(false);
}

  const [currentDropDownOption , updateDropDownOption] = useState(0);

  const [selectedListType , updateSelectedListType] = useState(currentOption);
  const onOptionChange = async(updatedOption) => {
    updateCurrentOption(updatedOption)
    if(updatedOption !== currentOption){
      updateNoCardsStatus(false);
      
      if(updatedOption === "mycollection"){
        setIsCardsLoading(true)
        await fetchCollections();
        updateSelectedListType(updatedOption)
      }else if(updatedOption === "favorite"){
        if(selectedListType !== "favorite"){
          setIsCardsLoading(true)
          await fetchFavoriteCards(selectedList);
          updateSelectedListType(updatedOption)
          setIsCardsLoading(false);
        }else if(selectedList.length === 0){
          updateNoCardsStatus(true)
        }
      }else if(updatedOption === "myorders"){
        updateSearchInput("");
        await fetchOrderHistory();
      }
    }
    console.log("selected list type",selectedListType)

  } 
 console.log("selected list",selectedList)
  const fetchFavoriteCards = async(currList) => {
    const result = await backendActor?.getFavorites(principal)
    console.log("resssssssult" , result);
    if(result.ok?.length>0){

      const favItems =new Set(result.ok);

     
     // console.log("selected list",selectedList)
     const favCardslist = currList
     .map(item => item[0])
     .filter(card => favItems.has(card.tokenId)); 
      console.log("favList",favCardslist)
      updateSelectedList(favCardslist);
      
    }else{
      console.log("no cards in fav")
      updateSelectedList([]);
      updateNoCardsStatus(true);
      
    }
    
  }

 


  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? selectedList.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === selectedList.length - 1 ? 0 : prevIndex + 1));
  };

   
   
  //  console.log("is authenticated in profile section" , isAuthenticated);
 
  useEffect(() => {
    setCurrentIndex(0);

  },[selectedList])











const {t} = useTranslation();
const { backendActor } = useAuth({});

const [userDetails,updateUserDetails] = useState({})
const [userName,updateUserName] = useState("");
const [email,updateEmail] = useState("");
const [telegramUrl,updateTelegramUrl] = useState("");

const [isDisplayEditProfile,updateEditProfileStatus] = useState(false);
const [profileUpdateInProcess,setProfileUpdateInProcess] = useState(false);
// const [displayProfileUpdateSuccess,updateDisplayProfileUpdateSuccess] = useState(false);





const isValidTelegramUsername = (telegramUrl) => {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
  return usernameRegex.test(telegramUrl);
};

const onClickUpdateUserDetails = async() => {
  setProfileUpdateInProcess(true);
  console.log("user name",userName)
  console.log("email id",email);
  console.log("telegram",telegramUrl);
  let updatedName = userName === undefined ? "No Name" : userName;
  let updatedEmail = email === undefined ? "No Email" : email;
  let updatedTelegramUrl = telegramUrl === undefined || telegramUrl === "" ? "No Telegram" : telegramUrl;



  // Validate Telegram username
  if (updatedTelegramUrl && updatedTelegramUrl != "No Telegram" && !isValidTelegramUsername(updatedTelegramUrl)) {
    toast.error("Invalid Telegram username. It must be 5-32 characters long and can only contain letters, numbers, and underscores.");
    setProfileUpdateInProcess(false); // Stop further processing
    return;
  }

  console.log("updated user details", updatedName, updatedEmail, updatedTelegramUrl);

   try{
    await backendActor?.updateUserDetails(Principal.fromText(principal),updatedName,updatedEmail,updatedTelegramUrl,[]);
    updateUserDetails({name:updatedName,email:updatedEmail,telegramUrl:updatedTelegramUrl});
    toast.success("Updated Successfully!")
    updateUserName("");
    updateEmail("");
    updateTelegramUrl("");
    updateEditProfileStatus(false);
   }catch(error){
    console.log(error)
   }finally{
    setProfileUpdateInProcess(false);
   }
    
   
    // updateDisplayProfileUpdateSuccess(true);
  //  console.log("updatedUserDetails result",updateResult);
}

useEffect(()=>{
  fetchUserDetails()
},[])

useEffect(()=>{  
  if(userDetails?.name !== "No Name"){
    updateUserName(userDetails.name);
  }
  if(userDetails?.email !== "No Email"){
    updateEmail(userDetails?.email);
  }
  if(userDetails?.telegramUrl !== "No Telegram"){
    updateTelegramUrl(userDetails.telegramUrl);
  }

},[userDetails])



const fetchUserDetails= async () => {
     const fetchUserResults= await backendActor?.getUserDetails(Principal.fromText(principal));
      console.log("user details" , fetchUserResults)
     if(Array.isArray(fetchUserResults.ok)){
       const result = fetchUserResults.ok;
        
      const newDetails = {
        name : result[3],
        email : result[4],
        telegramUrl : result[5],
       }
       updateUserDetails((prev)=>({...prev,...newDetails}))
       updateUserDetailsLoading(false);
     }
    
}



const [orderHistory,updateOrderHistory] = useState([]);

// const orders_per_page = 5;
//   const [current_page,updateCurrentPage] = useState(0);
//   const [total_pages,updateTotalPages] = useState(0);
useEffect(()=>{
  fetchOrderHistory();
},[])
// const chunkSize = 2;
const fetchOrderHistory = async () => {
  console.log("before")
  const result = await backendActor?.getuserorders(Principal.fromText(principal));
  console.log("after")
  console.log("result in my orders", result);

  let historyResponse=[];
  const updatedOrderHistory = [];
  
  if(result.ok){
    historyResponse = result.ok;
    // const total_pages = result.ok.total_pages;
   // updateTotalPages(parseInt(result.ok.total_pages));
  }else{
    updateOrderHistory([]);
    return;
  }

  historyResponse.map((eachOrder) => {
    console.log("each order in fetch",eachOrder)
    const updatedOrder = {
      orderId: parseInt(eachOrder.id),
      collectionName: getCollectionName(eachOrder.collectionCanisterId),
      collectionId: eachOrder.collectionCanisterId,
      country: eachOrder.country || "",
      city: eachOrder.city || "",
      address: eachOrder.address || "",
      phone: eachOrder.phone || "",
      email: eachOrder.email || "",
      pinCode: eachOrder.pincode || "",
      landmark: eachOrder.landmark.length > 0 ? eachOrder.landmark[0] : "",
      orderTime: eachOrder.orderTime ? eachOrder.orderTime.toString() : "",
    };

    updatedOrderHistory.push(updatedOrder);
  });
 
  updateOrderHistory(updatedOrderHistory);
  console.log("order history", updatedOrderHistory);
};

const onChangeSearchInput = (currentSearchText)=>{
  updateSearchInput(currentSearchText);
}



 const getCollectionName = (id) => {
  const collection = allCollectionsList.find(element => {
    console.log("inside getCollectionName",element, element.collectionId, id);
    return element.collectionId.toText() === id.toText();
  });
  console.log("is true",collection)
  return collection ? collection.name : null;
}



  const checkIsFavourite = async(tokenId) => {
      const ids = await backendActor?.getFavorites(principal);
      // console.log("iddddddddds",ids);
      if(ids.ok?.length>0){
        console.log("inside if")
        for(let i=0;i<ids.ok.length;i++){
        console.log("fav token id",ids.ok[i]);
        if(ids.ok[i] == tokenId){
          return true;
        }
      }
      }
      
      return false;
  

  }

const fetchCollections = async () => {
     console.log("all collection list ",allCollectionsList);
    if(allCollectionsList.length === 0){
      updateNoCardsStatus(true);
      return;
    }
    const currentSelectedCollection = allCollectionsList[currentDropDownOption];
    const updatedCardsList = await getSelectedOptionCards(currentSelectedCollection.collectionId);
    setIsCardsLoading(false);
    if(updatedCardsList?.length >0){
      updateSelectedList(updatedCardsList);
    }else{
      updateNoCardsStatus(true);
    }
};

  const getSelectedOptionCards =  async(collectionId) => {
    let updatedCardsList = [];
    console.log("before profile function")
    const collectionDetailsResult = await backendActor.userNFTcollection(collectionId,principal)
    console.log("profile result",collectionDetailsResult)
    const ownedNfts = collectionDetailsResult.ok.boughtNFTs;
    console.log("owned nfts after fetching",ownedNfts);
    const notOwnedNfts = collectionDetailsResult.ok.unboughtNFTs;
    console.log("not owned nfts after fetching",notOwnedNfts);
    const updatedOwnedList = await getUpdatedList(collectionId,ownedNfts,[],true);
   console.log("owned nfts",updatedOwnedList);
    
    const updatedNotOwnedNfts = await getUpdatedList(collectionId,notOwnedNfts,updatedOwnedList,false);
   // console.log("not owned nfts",updatedNotOwnedNfts);
    updateRemainingNfts(updatedNotOwnedNfts.length);
  
    if(updatedOwnedList.length == 0){
      updateSelectedList([]);
      return []
    }else{
      updatedCardsList = [...updatedOwnedList,...updatedNotOwnedNfts];
      return updatedCardsList;
    }
    
    
    
    
    
    

  }

  const getUpdatedList= async(collectionId,cardsList,ownedList,isOwned)=>{

      
      console.log("cards list",cardsList)
      const formatedList = [];
      let tempIndex = 0;
      for(let i=0;i<cardsList.length;i++){
        const eachCard = cardsList[i];
        console.log("each card",eachCard);
        const cardDetails = eachCard[2].nonfungible;
        let skipCard = false;
        if(!isOwned){
          console.log("owned list in getUpdatedlist",ownedList)
          for(let i = 0; i< ownedList.length;i++) {
            if(ownedList[i][0].cardName === cardDetails.name){
              skipCard = true;
              continue;
            }
          }
        }
        if(skipCard){
          continue;
        }

          console.log("card details",cardDetails)
          const metadata = JSON.parse(cardDetails.metadata[0].json);
          let isFav = false;
          if(isOwned){
           isFav = await checkIsFavourite(eachCard[0]);
          }
          // console.log("all collections",allCollectionsList,"currentindex",currentDropDownOption);
          
          const tempcard= {
                tokenId:eachCard[0],
                index : eachCard[1],
                collectionId,
                cardName:cardDetails.name,
                cardImageUrl:cardDetails.thumbnail,
                cardType:metadata.nftType,
                isOwned,
                isFavourite : isFav,
                borderColor : metadata.nftcolor,
                collectionColor : allCollectionsList[currentDropDownOption].collectionColor,
                price : parseInt(eachCard[5][0])/100000000
             }
             formatedList.push([tempcard])

      }

      return formatedList;
    
  }
   

   useEffect(()=>{
      fetchCollections()
      
   },[])


   

   const removeFromFavorites = async(tokenId) => {
    setAreButtonsDisabled(true);
  
    const resultPromise = new Promise(async(resolve,reject)=>{
      const result = await backendActor?.removeFromFavorites(principal,tokenId);
      if (result?.ok) {
        resolve(result); 
      } else {
        setAreButtonsDisabled(false);
        reject(result?.err?.Other || 'Failed to remove from favorites'); 
      }
    })
    toast.promise(resultPromise, {
      loading: 'Removing from favorites...',
      success: 'Successfully removed from favorites!',
      error: (errorMsg) => errorMsg || 'An error occurred while removing from favorites.',
    });
   const res = await resultPromise;
    if(currentOption === "favorite"){
      const updatedFavList = selectedList.filter((eachItem)=> (eachItem.tokenId != tokenId));
      updateSelectedList(updatedFavList);
    }else{
      const modifiedSelectedList = selectedList.map((eachItem)=>{
        if(eachItem[0].tokenId === tokenId){
          return  [{...eachItem[0],isFavourite:false},...eachItem.slice(1)];
        }
        return eachItem;
       })
       updateSelectedList(modifiedSelectedList)
  
    }
    setAreButtonsDisabled(false);
  }



  
const addToFavorites = async (tokenId) => {
  setAreButtonsDisabled(true); 


  const resultPromise = new Promise(async (resolve, reject) => {
    const result = await backendActor?.addToFavorites(principal, tokenId);
    
    if (result?.ok) {
      resolve(result); 
    } else {
      setAreButtonsDisabled(false);
      reject(result?.err?.Other || 'Failed to add to favorites'); 
    }
  });

  
  toast.promise(resultPromise, {
    loading: 'Adding to favorites...',
    success: 'Successfully added to favorites!',
    error: (errorMsg) => errorMsg || 'An error occurred while adding to favorites.',
  });

  const result = await resultPromise;

  const modifiedSelectedList = selectedList.map((eachItem) => {
    const eachCard = eachItem[0];
    if (eachCard.tokenId === tokenId) {
      return [{ ...eachCard, isFavourite: true }, ...eachItem.slice(1)];
    }
    return eachItem;
  });

  updateSelectedList(modifiedSelectedList);

  setAreButtonsDisabled(false);
};

const onChangeFilterOption = async(eachCollection) => {
  if (eachCollection.index != currentDropDownOption) {
    updateDropDownOption(eachCollection.index);
    updateDropDownStatus(!isDisplayCollectionDropDown);
    updateNoCardsStatus(false);
    setIsCardsLoading(true);
    const updatedCardsList = await getSelectedOptionCards(eachCollection.collectionId);
    
    if(updatedCardsList?.length >0){
      if(currentOption === "favorite"){
        await fetchFavoriteCards(updatedCardsList);
      }else{
        updateSelectedList(updatedCardsList);
      }
    }else{
      updateNoCardsStatus(true);
      
    }
    setIsCardsLoading(false);
  }
  
 }
// console.log("selected List",selectedList);
  const isPlaced = (currentId)=> {
    console.log("orderlist in isplaced",orderHistory)
    for(let i =0;i< orderHistory.length;i++){
      const order = orderHistory[i];
    //  console.log("inside isplaced outside if",currentId.toText(),order.collectionId.toText());
      if(order.collectionId.toText() === currentId.toText()){
        console.log("is true")
        return true;
      }
    }
    return false;
  }

  const onClickViewDetails = (order) => {
    console.log("order",order);
    updateOrderPlacedStatus(true);
    updateOrderId(parseInt(order.orderId));
    updateSelectedCountry(order.country || ""); 
    const cities = City.getCitiesOfCountry(order.country);
    updateCityList(cities);
    updatePhoneNumber(order.phone || NaN); 
    updateOrderEmail(order.email || ""); 
    updateStreetAddress(order.address || ""); 
    updatePinCode(order.pinCode || NaN); 
    updateSelectedCity(order.city || ""); 
    updateLandMark(order.landmark.length > 0 ? order.landmark : "");
    updatePlaceOrderLoading(false);
    updateOrderingStatus(buyingStatus.deliveryInfo); 
    setplaceOrderPopup(true); 
  }
  const [isExpanded, setIsExpanded] = useState(false); // State to handle expansion

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  if(isDisplayEditProfile || placeOrderPopup){
    document.body.style.overflow = "hidden"
  }else{
    document.body.style.overflow = "auto"
  }


  
  const filteredOrderedHistory = orderHistory.filter((eachOrder) => 
    eachOrder.collectionName.toLowerCase().includes(searchInput.toLowerCase())
  );
  

  return (
    <div className={`font-caslon w-full`} onClick={()=>updateDropDownStatus(false)}>
      <div style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
        <Navbar />
        <div className='max-w-[1920px] mx-auto md:pl-[3%] mt-[5%] sm:mt-[3%] flex flex-col lg:flex-row'>
        <div className='w-full lg:w-[400px]  '>
    <h1 className='text-center lg:text-start text-[#FFFFFF] text-[32px] sm:text-[40px] leading-[60px] font-[400]'>{t('myProfile')}</h1>
    {!isUserDetailsLoadging && (
      <div className='flex gap-8 mt-[5%] lg:mt-[2%] lg:ml-[2%]'>
        <div className='flex flex-col items-center'>
          <img src="/image/Frame.png" alt="" />
          <div className='mt-5'>
            {userDetails.telegramUrl === "No Telegram" ? (
              <div className="relative group">
                <FaTelegram size={25} color='#C5E8F2' style={{ opacity: 0.5 }} />
                <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#000000] text-[#FCD378] w-[180px] lg:w-[220px] text-center py-1 rounded text-xs transition-opacity duration-300">
                  Add your telegram user name!
                </span>
              </div>
            ) : (
              <a
                href={`https://t.me/${userDetails.telegramUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <FaTelegram size={25} color='#24A1DE' />
              </a>
            )}
          </div>
        </div>
        <div className='max-w-[200px]'>       
          <div className='flex items-center'>
            <div>
              <h1 className='text-[20px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px]'>
                {userDetails.name === "" ? "No Name":(userDetails.name)}
              </h1>
              <h1 className='text-[13px] sm:text-[16px] font-[400] text-[#FFFFFF] leading-[20px] my-3 max-w-[190px] md:max-w-[220px]'>
                {!isExpanded && userDetails.email.length > 34 ? (
                  <>
                    <span className='flex items-center'>
                      {userDetails.email.slice(0, 28)}...
                      <MdExpandMore
                        onClick={handleToggle}
                        style={{ cursor: "pointer" }}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    {userDetails.email === "" ? "No Email":(userDetails.email)}
                    {userDetails.email.length > 32 && (
                      <MdExpandLess
                        onClick={handleToggle}
                        style={{ cursor: "pointer", display: "inline" }} 
                      />
                    )}
                  </>
                )}
              </h1>
              <h2 className='ext-[20px] sm:text-[22px] font-[400] text-[#FFFFFF] leading-[25px] flex items-center'>
                User Id: {principal.slice(0,4)}....{principal.slice(-4)}
                <CopyToClipboard text={principal}>
                  <span className="ml-2 cursor-pointer text-slate-300" onClick={()=>toast.success("Copied")}>
                    <RiFileCopyLine />
                  </span>
                </CopyToClipboard>    
              </h2>
              <button
                onClick={()=>updateEditProfileStatus(true)}
                className='flex items-center justify-center mt-4 w-[130px] h-[30px] sm:w-[100px] sm:h-[28px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon rounded-sm'>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>


          <div className='w-full lg:w-[70%]'>
            <div className='flex items-center justify-center gap-[10%] mt-8 lg:mt-0 mb-10 md:mb-1'>
              <button
                className={`text-[18px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "mycollection" ? 'border-b-4 border-[#FFD700]' : ''}`}
                onClick={() => onOptionChange("mycollection")}
              >
                {t('myCollection')}
              </button>
              <button
                className={`text-[18px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "favorite" ? 'border-b-4 border-[#FFD700]' : ''}`}
                onClick={() => onOptionChange("favorite")}
                disabled = {areButtonsDisabled}
              >
                {t('favorite')}
              </button>
               <div
                className={`text-[18px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "myorders" ? 'border-b-4 border-[#FFD700]' : ''}`}
                onClick={()=>onOptionChange("myorders")}
              >
                {t('myOrders')}
              </div> 
            </div>
            {allCollectionsList.length>0 && currentOption !== "myorders" && (
              <div className="relative z-10 flex items-center justify-between mt-5 ml-4 md:w-full ">
                           
              <button
                  onClick={(e)=>{e.stopPropagation(),updateDropDownStatus(!isDisplayCollectionDropDown)}}
                  className={`rounded-full flex justify-center items-center gap-1 
                 min-w-[120px] h-[35px] sm:h-[40px]  md:w-[180px] p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 border-gray-800`}
              >
                  <BiCategory />
                  {allCollectionsList[currentDropDownOption].name}
              </button>
              {isDisplayCollectionDropDown && (
                      <ul className="absolute top-10 left-0 mt-2  bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none  min-w-[120px]   md:w-[180px] max-h-[160px] overflow-y-auto ">
                          {allCollectionsList.map((eachCollection,index)=>(
                              <>
                                  <div key={eachCollection.index} className='flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900'
                                  onClick={()=>onChangeFilterOption(eachCollection)}>
                                      <li key={eachCollection.index}>{eachCollection.name}</li>
                                      {currentDropDownOption === eachCollection.index && (
                                        <IoCheckmarkOutline />
                                      )}
                                  </div>
                                  {index != allCollectionsList.length-1 && ( <hr className="m-0 border-t border-[#FCD378]" />)}
                              </>
                          ))}
                      </ul>
                  )}
                {currentOption === "mycollection" && !isCardsLoading && (
                      <div className='flex flex-col items-center mr-5 md:items-end lg:mr-20'>
                      <div className='flex items-center justify-end '>
                          
                            {isPlaced(allCollectionsList[currentDropDownOption].collectionId)?(
                                <h1 className='bg-[#FCD378] border-none text-[#000000] h-[35px] w-[150px] rounded-sm flex justify-center items-center'>Order Placed!</h1>
                            ):(
                              <div className={`relative ${remainingNftsCount>0 && "group"}`}>
                              <button 
                                disabled={remainingNftsCount > 0} 
                                className={`bg-[#FCD378] border-none text-[#000000] h-[35px] w-[150px] rounded-sm ${remainingNftsCount === 0 ? "opacity-100" : "opacity-40 cursor-not-allowed"}`}
                                onClick={togglePlaceOrderPopup}
                              >
                                Unlock Achievement
                              </button>
                              
                                <span className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 hidden group-hover:opacity-100 group-hover:block bg-[#000000] text-[#FCD378] w-[180px] lg:w-[250px] text-center py-1 rounded text-xs`}>
                                Buy remaining {remainingNftsCount} nfts to place order!
                              </span>
                              
                            </div>
                            )}
                          </div>
                      </div>
                    )}
          </div>
            ) }
            {/* Small screen view for single image display with prev and next buttons */}
            
            {currentOption !== "myorders" && (
              <div className='z-0 flex items-center justify-between mt-8 mb-10 sm:hidden'>
              
              <button onClick={handlePrev}>
                <img src="/Hero/up.png" alt="Previous" className='w-14 h-14 -rotate-90' />
              </button>

              {noCards ? (
                <h1 className='text-[#FFD700] text-[22px] my-20'>No Cards Availalble</h1>
              ):(
                (isCardsLoading ? (
                  <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                  <div className='mb-8'>
                      <Skeleton count={1} width={250} height={350} />
                  </div>
              </SkeletonTheme>
                ):(
                  (
                    selectedList && selectedList.length>0 ? (
                      <div>
                       {currentOption === "mycollection" ? (
                         <NftCard img={selectedList[currentIndex][0]} key={currentIndex} removeFromFavorites={removeFromFavorites} addToFavorites = {addToFavorites} quantity={selectedList[currentIndex].length} buttonStatus = {areButtonsDisabled} /> 
                      ):(
                        <NftCard img={selectedList[currentIndex]} key={currentIndex} removeFromFavorites={removeFromFavorites} addToFavorites = {addToFavorites} buttonStatus = {areButtonsDisabled}/> 
                      )} 
                    </div>
                    ):(
                      <h1 className='text-[#FFD700] text-[22px] my-20'>No Cards Availalble</h1>
                    )
                  )
                ))
              )}
              
              <button onClick={handleNext}>
                <img src="/Hero/down.png" alt="Next" className='w-14 h-14 -rotate-90' />
              </button>
            </div>
            )}
          
            {/* Grid view for larger screens */}
           {currentOption !== "myorders" && (
             (noCards ? (
              <div className='hidden w-[90%] h-[80vh] sm:flex justify-center items-center '>
                <h1 className='text-[#FFD700] text-[40px]'>No Cards Available</h1>
              </div>
          ):(
            
             (isCardsLoading ? (
                      <div className="pb-10">
                      <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                        <div className="justify-around hidden gap-5 m-5 md:grid md:grid-cols-3 xl:grid-cols-4">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton
                              key={index}
                              count={1}
                              width={210}
                              height={300}
                            />
                          ))}
                        </div>
                      </SkeletonTheme>
                      </div>
                  ):(
                    <>
                   
                  {selectedList.length === 0 ? (
                    <div className='hidden w-[90%] h-[70vh] sm:flex justify-center items-center '>
                    <h1 className='text-[#FFD700] text-[40px]'>No Cards Available</h1>
                  </div>
                  ):( 
                    <>
                    <div className='hidden w-[90%] min-h-[65vh] sm:grid sm:grid-cols-3 2xl:grid-cols-4 gap-24 lg:gap-4 mt-8 sm:mx-10 mb-8'>
                    {selectedList && selectedList.length > 0 && selectedList.map((img, index) => (
                      <div className='w-full rounded-lg flip-card'>
                        {currentOption === "mycollection" ? (
                          <NftCard img={img[0]} key={index} removeFromFavorites={removeFromFavorites} addToFavorites = {addToFavorites} quantity = {img.length} buttonStatus = {areButtonsDisabled} />
                        ):(
                          <NftCard img={img} key={index} removeFromFavorites={removeFromFavorites} addToFavorites = {addToFavorites} buttonStatus = {areButtonsDisabled} />
                        )}
                      </div>
                    ))}
                  
                  </div>
                  
                  </>
                  )}
                  </>
                  ))
          ))
           )}
           {currentOption === "myorders" && (
            <div className='w-[97%] min-h-[80vh] sm:my-10  mb-8 pl-[3%] '>
              <div className='mb-5 flex justify-end '>
                <div className=' border border-[#FCD378] w-full sm:w-[300px] h-[33px] flex items-center'>
                  <input type='search'
                   className=' px-2 text-[#FCD378]  outline-none bg-transparent w-[90%]
                   placeholder-[#FCD378] placeholder-opacity-55 rounded-[2px]
                   ' 
                   placeholder='Enter collection name' 
                   onChange={(e)=>onChangeSearchInput(e.target.value)} 
                   />
                   <LiaSearchSolid color='#FCD378' size={17} />
                  </div>
              </div>
            <ul className='w-[100%] h-[50px] lg:h-[40px] text-[#FCD378] text-md lg:text-xl bg-[#FCD37B1A] m-0  grid grid-cols-3  items-center mb-[21px]'>
                  <li className='flex justify-center items-center'>Order Id</li>
                  <li className='flex justify-center items-center'>Collection</li>
                  <li className='flex justify-center items-center'>Details</li>
            </ul>
            <div>
            {filteredOrderedHistory.length>0 ?(
              filteredOrderedHistory.map((eachOrder)=>(
                <ul key={eachOrder.orderId} className='w-[100%] h-[75px] lg:h-[100px] text-[#FCD378] text-md md:text-lg bg-[#FCD37B1A] m-0  grid grid-cols-3 items-center mb-[21px] overflow-x-auto'>
                <li className='flex justify-center items-center'>{eachOrder.orderId}</li>
                <li className='flex justify-center items-center'>{eachOrder.collectionName}</li>
                <li className='flex justify-center items-center'><button className='text-[#000000] bg-[#FCD378] px-2 rounded-sm' 
                onClick={()=>onClickViewDetails(eachOrder)}
                >view details</button></li>
            </ul>
              ))
            
            ):(
              <div className='w-[90%] min-h-[58vh] sm:my-10 ml-[6%] mb-8 flex justify-center items-center'>
                <h1 className='text-[#FFD700] text-[22px] my-20'>No Orders Were Placed!</h1>
              </div>
            )}
             
          </div>
            </div>
           )}
          </div>
        </div>
      </div>

      <div style={{backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='relative overflow-hidden bg-center bg-cover'>
        <Footer />
      </div>
      {isDisplayEditProfile && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-20 w-screen h-screenn">
        <div className="w-screen h-screen top-0 bottom-0 right-0 left-0 fixed bg-[rgba(49,49,49,0.8)]">
          <div className="flex items-center justify-center h-screen">
            <div
              className="w-[90vw] lg:w-[30vw] bg-[#111] text-white font-caslon p-5 md:p-8 rounded-md overflow-y-auto drop-shadow-lg "
            >
                <div>
                  <div className=' mb-5'>
                <div className='flex flex-col mb-3'>
                  <label className='lg:text-lg'>Name</label>
                  <input onChange={(e)=>updateUserName(e.target.value)} type='text' placeholder='Enter your name' className='pl-2 bg-transparent border border-white h-[30px] text-[13px] rounded-sm ' value={userName}/>
                </div>
                <div className='flex flex-col mb-3'>
                  <label className='lg:text-lg'>Email</label>
                  <input onChange={(e)=>updateEmail(e.target.value)} type='email' placeholder='Enter your email' className='pl-2 bg-transparent border border-white h-[30px] text-[13px]  lg:text-md rounded-sm' value={email} />
                </div>
                <div className='flex flex-col mb-3'>
                  <label className='lg:text-lg'>Telegram</label>
                  <input onChange={(e)=>updateTelegramUrl(e.target.value)} type='text' placeholder='Enter your telegram user name' className='pl-2 bg-transparent border border-white h-[30px] text-[13px]  lg:text-md rounded-sm' value={telegramUrl} />
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <button className={`w-20 border-none bg-[#FCD378] text-black h-6 mr-3 rounded-full ${profileUpdateInProcess && "opacity-30"} `}  
                disabled={profileUpdateInProcess}
                onClick={()=>updateEditProfileStatus(false)}
                >Cancel</button>
                {profileUpdateInProcess ? (
                  <div className='flex justify-center items-center w-20 border-none bg-[#FCD378] text-black h-6 rounded-full'>
                  <MoonLoader
                  color="#000000"
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                </div>
                ):(
                  <button className={`w-20 border-none bg-[#FCD378] text-black h-6 rounded-full `}
                onClick={()=>onClickUpdateUserDetails()}
                >Update</button>
                )}
              </div>
                </div>
          </div> 
        </div>
    </div>
  </div>
      )}
      {placeOrderPopup && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-20 w-screen h-screen">
        <div className="w-screen h-screen top-0 bottom-0 right-0 left-0 fixed bg-[rgba(49,49,49,0.8)]">
          <div className="flex items-center justify-center h-screen">
          <div className={`bg-[#111] text-white font-caslon p-3 md:p-8 rounded-md overflow-y-auto drop-shadow-lg ${
            currentOrderingStatus === buyingStatus.deliveryInfo
              ? "w-[95vw] md:w-[95vw]  lg:w-[80vw]  xl:w-[60vw] "
              : currentOrderingStatus === buyingStatus.showCollection? " w-[95vw] md:w-[50vw]  lg:w-[60vw] xl:w-[40vw] "
              : "h-[30vh] w-[60vw] md:w-[40vw] md:h-[25vh] lg:w-[30vw] lg:h-[20vh] xl:h-[35vh] xl:w-[26vw]"
          }`}>
             {!placeOrderLoading && (
              (isOrderPlaced ? (
                <div className="relative flex items-center justify-end">
              <button
                className="text-[#ffffff] absolute bottom-1 top-1"
                onClick={() => {togglePlaceOrderPopup();resetFormFields()}}
              >
                <RxCross2 size={20} />
              </button>
            </div>
              ):(
                <div className="relative flex items-center justify-end">
              <button
                className="text-[#ffffff] absolute bottom-1 top-1"
                onClick={() => togglePlaceOrderPopup()}
              >
                <RxCross2 size={20} />
              </button>
            </div>
              ))
             )}
            {currentOrderingStatus === buyingStatus.showCollection && (
              <div className="h-[90%]  flex flex-col items-center justify-center gap-2 mt-4">
                <h1 className="text-xl lg:text-3xl font-semibold text-[#FCD37B] ">CONGRATULATIONS!!!</h1>
                <p className="my-1 text-sm font-medium font-caslonAntique">You Unlocked</p>
                <img src={allCollectionsList[currentDropDownOption].image} className=" w-[80px] h-[80px] lg:w-[150px] lg:h-[150px] rounded-full drop-shadow-lg" />
                <h1 className="my-3 text-lg font-semibold lg:text-3xl">
                  {allCollectionsList[currentDropDownOption].name.toUpperCase()} {'  '} {' '} COLLECTION
                </h1>
                {/* <button
                  
                  className="mt-3 w-40 border border-white border-solid cursor-pointer bg-[#1E62AC]"
                >
                  Get A Hard Copy
                </button> */}
                <div className=" w-[190px] lg:w-[220px] p-2 border-[1px] border-[#FCD37B]">
                <button
                  className="w-full text-black bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[30px] font-caslon font-semibold "
                  onClick={() => updateOrderingStatus(buyingStatus.deliveryInfo)}
                >
                  Get Hard Copy
                </button>
                
              </div>
              </div>
            )}
            {currentOrderingStatus === buyingStatus.deliveryInfo && (
              <div className="md:mt-5">
                <h1 className="text-2xl font-semibold">Delivery Info.</h1>
                <div className="relative flex items-center my-3">
                  <img
                    src={allCollectionsList[currentDropDownOption].image}
                    className=" w-[70px] h-[70px]  rounded-full"
                  />
                  <div className="ml-2">
                    <h1 className="text-lg font-semibold">{allCollectionsList[currentDropDownOption].name.toUpperCase()} {'  '} {' '} COLLECTION</h1>
                    <p className="text-sm font-extralight">Hard Copy</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col w-[40%] relative">
                    <label className="text-lg font-semibold">
                      Phone No.<span className="absolute text-red-700 -top-1">*</span>
                    </label>
                    <input
                      type="number"
                      className="bg-transparent border-0 border-b border-white border-solid"
                      value={phoneNo}
                      onChange={(e)=>updatePhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-[40%] relative">
                    <label className="text-lg font-semibold">
                      Email<span className="absolute text-red-700 -top-2">*</span>
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-0 border-b border-white border-solid"
                      value={orderEmail}
                      onChange={(e)=>updateOrderEmail(e.target.value)}
                    />
                  </div>
                </div>
                <h1 className="mt-3 text-lg font-semibold">Address</h1>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex flex-col w-[35%]">
                    <label className="relative text-sm font-extralight">
                      H No, St No
                      <span className="absolute text-red-700 -top-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-0 border-b border-white border-solid"
                      value={streetAddress}
                      onChange={(e)=>updateStreetAddress(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-[35%]">
                    <label className="relative text-sm font-extralight">
                      City<span className="absolute text-red-700 -top-1">*</span>
                    </label>
                    <select
                      className="bg-transparent border-b font-Quicksand"
                      value={selectedCity}
                      onChange={onChangeCity}
                    >
                      <option value="" disabled hidden></option>
                      {selectedCountry==="" ? (
                        <option
                          value=""
                          disabled
                          className="text-white bg-black border-0 border-none font-Quicksand"
                        >
                          Select a country first
                        </option>
                      ) : cityList.length === 0 ? (
                        <option value="" disabled>
                          No cities available
                        </option>
                      ) : (
                        cityList.map((eachCity) => (
                          <option
                            value={eachCity.id}
                            key= {uuidv4()}
                            className="bg-black border-0 border-none font-Quicksand"
                          >
                            {eachCity.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col w-[20%] relative">
                    <label className="text-sm font-extralight">
                      Country
                      <span className="absolute text-red-700 -top-1">*</span>
                    </label>
                    <select
                      className="bg-transparent border-b font-Quicksand"
                      value={selectedCountry}
                      onChange={onChangeCoutry}
                    >
                      <option value="" disabled hidden></option>
                      {countries.map((eachCountry) => (
                        <option
                          value={eachCountry.id}
                          key={eachCountry.id}
                          className="bg-black border-0 border-none font-Quicksand"
                        >
                          {eachCountry.displayText}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative flex items-center justify-between mb-5">
                  <div className="flex flex-col w-[35%]">
                    <label className="text-sm font-extralight">
                      Pincode
                      <span className="absolute text-red-700 -top-1">*</span>
                    </label>
                    <input
                      type="number"
                      className="bg-transparent border-0 border-b border-white border-solid"
                      value={pinCode}
                      onChange={(e)=>updatePinCode(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-[35%] ">
                    <label className="text-sm font-extralight">
                      Nearby Landmark
                    </label>
                    <input
                      type="text" 
                      className="bg-transparent border-0 border-b border-white border-solid"
                      value={landMark}
                      onChange={(e)=>updateLandMark(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-[20%] relative">
                   
                  </div>
                </div>
                <div className="">
                  <p className="text-sm font-extralight">
                    <span className="mr-2 text-red-700">*</span>
                    Mandatory Information
                  </p>
                </div>
                <div className='flex justify-center'>
                {isOrderPlaced ? (
                      <div className='w-[80%] md:w-[70%] lg:w-[60%] flex justify-between '>
                      <div className="flex justify-center w-[120px] lg:w-[220px] p-2 border-[1px] border-[#FCD37B] mr-5">
                  <button className="w-full text-[15px] lg:text-[18px] text-black bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                  onClick={()=>onClickOrder("update")}
                  >
                    Update Order
                  </button>
                </div>
                <div className="flex justify-center w-[120px] md:w-[180px] lg:w-[220px] p-2 border-[1px] border-[#FCD37B]">
                  <button className="w-full text-[15px] lg:text-[18px] text-black bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                  onClick={onClickRemoveOrder}
                  >
                    Remove Order
                  </button>
                </div>
                      </div>
                ):(
                  <div className="flex justify-center w-[190px] lg:w-[220px] p-2 border-[1px] border-[#FCD37B]">
                  <button className="w-full text-black bg-[#FCD37B] border border-[#FCD37B] rounded-[3px] hover:bg-[#D4A849] hover:border-[#D4A849] h-[35px] font-caslon font-semibold "
                  onClick={()=>onClickOrder("placeorder")}
                  >
                    Place Order
                  </button>
                </div>
                )}
                </div>
                
              </div>
            )}
            {currentOrderingStatus === buyingStatus.placeOrderStatus && (
              <div className='text-white h-[90%] flex justify-center items-center'>
        
                {placeOrderLoading ? (
                  <div className=' '>
                    <FadeLoader color='grey' />
                  </div>
                ):(
                  <div>
                    <h1 className='text-white'>{orderMsg}</h1>
                  </div>
                )} 
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default Profile;