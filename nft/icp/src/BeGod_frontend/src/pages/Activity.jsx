import React, { useEffect, useState, useMemo } from 'react';

import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../utils/useAuthClient';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

import ReactTimeAgo from 'react-time-ago';
import { useNavigate } from 'react-router-dom';
import { updateCurrentIndex } from '../redux/infoSlice';

const Activity = () => {
  const { principal, backendActor } = useAuth();
  const collections = useSelector((state) => state.info.collectionList);
  const [activityList, updateActivityList] = useState([]);
  const [loading, updateLoadingStatus] = useState(true);
  const [noActivity, updateNoActivityStatus] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      console.log(principal, 'principal');
    }
  }, [isAuthenticated]);

  const dispatch = useDispatch();
 useEffect(()=>{
  dispatch(updateCurrentIndex(0));
 })
  // Fetch user activity
 
  const cards_per_page = 5;
  const [current_page,updateCurrentPage] = useState(1);
  const [total_pages,updateTotalPages] = useState(1);

  useEffect(() => {
    fetchUserActivity();
  }, [current_page]);


  const fetchUserActivity = async () => {
    updateLoadingStatus(true);
    
    try {
      const result = await backendActor?.alluseractivity(principal,cards_per_page,current_page-1);
      console.log("avtivity result",result.ok.data);
        const total_pages = result.ok.total_pages;
        updateTotalPages(parseInt(result.ok.total_pages));
        console.log("avtivit fun result",result)
        const allActivities = result?.ok?.data?.map((eachItem) => {
          const timeInMilliSeconds = Number(eachItem[2].time) / 1000000;
          console.log("each avtivity",eachItem)
          return {
            collectionName: eachItem[3],
            tokenId: eachItem[1],
            price: Number(eachItem[2].price) / 100000000,
            time: new Date(timeInMilliSeconds),
            buyStatus: eachItem[4], 
          };
        });
   

   

      updateLoadingStatus(false);
      if (allActivities.length > 0) {
        updateActivityList(allActivities);
      } else {
        updateNoActivityStatus(true);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      updateLoadingStatus(false);
      updateNoActivityStatus(true);
    }
  };


  const sortedActivityList = useMemo(() => {
    return activityList.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [activityList]);

  const onClickNext = ()=>{
    updateCurrentPage(current_page+1)
  }
  const onClickPrev = ()=>{
    updateCurrentPage(current_page-1)
  }

  return (
    <div className="font-caslon">
      <div
        style={{
          backgroundImage: `url('/Hero/activity smoke.jpeg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'right',
        }}
      >
        <Navbar />
        <div className="p-[10px] min-h-[90vh] w-full lg:p-[70px] pb-[33px] ">
          <h1 className="text-3xl text-center mb-3 lg:text-5xl text-[#FCD378] lg:mb-5 lg:text-start">Activity</h1>
          <ul className="w-[100%] h-[50px] lg:h-[40px] text-[#FCD378] text-sm lg:text-lg bg-[#FCD37B1A] m-0 pl-[0px]  grid grid-cols-4 items-center mb-[21px]">
            <li className='text-center '>Collection</li>
            <li className='text-center '>Token Id</li>
            <li className='text-center '>Price</li>
            <li className='text-center '>Time</li>
          </ul>
          <div>
            {loading ? (
              <SkeletonTheme baseColor="#FCD37B1A" highlightColor="#FCD37B1A">
                <div className="hidden  lg:flex flex-col w-full ">
                  {Array.from({ length: cards_per_page}).map((_, index) => (
                    <Skeleton
                      key={index}
                      count={1}
                      width="100%" // Set width to 100%
                      height={100}
                      duration={2}
                      className="opacity-25 mb-[15px] "
                    />
                  ))}
                </div>
                <div className="flex flex-col w-full lg:hidden ">
                  {Array.from({ length: cards_per_page}).map((_, index) => (
                    <Skeleton
                      key={index}
                      count={1}
                      width="100%" // Set width to 100%
                      height={75}
                      duration={2}
                      className="opacity-25 mb-[15px] "
                    />
                  ))}
                </div>
              </SkeletonTheme>
            ) : noActivity ? (
              <div className="h-[65vh] flex items-center justify-center">
                <h1 className="text-[#FCD378] text-2xl">No Activity Found</h1>
              </div>
            ) : (
              sortedActivityList.map((eachActivity, index) => (
                <ul
                  key={index}
                  className="w-[100%] h-[75px] lg:h-[100px] text-[#FCD378] text-sm bg-[#FCD37B1A] m-0  pl-[0px]  grid grid-cols-4 items-center mb-[21px] overflow-x-auto"
                >
                  <li className='text-center '>{eachActivity.collectionName}</li>
                  <li className='text-center '>
                    {eachActivity.tokenId.slice(0, 5)}.....{eachActivity.tokenId.slice(-4)}
                  </li>
                  <li className='text-center '>{eachActivity.price} ICP</li>
                  <ul className='text-center'>
                    <li>{eachActivity.buyStatus}</li>
                    <li>
                      <ReactTimeAgo date={eachActivity.time} locale="en" />
                    </li>
                  </ul>
                </ul>
              ))
            )}
          </div>
          {total_pages > 1  && (
            <div className={`w-full flex justify-center items-center  text-[#FCD378] ${loading && "mt-[10px]"}  `}>
            <button className={`size-6 rounded-sm bg-[#FCD378] text-[#000000] flex justify-center items-center  ${current_page === 1 ? "opacity-30 cursor-not-allowed":"cursor-pointer"}`} disabled={current_page === 1} onClick={onClickPrev}>
              <GrFormPrevious />
            </button>
              <div className=' flex items-center justify-start max-w-[80%] overflow-x-auto'>
              {Array.from({length:total_pages}).map((_,index)=>(
                  <div className={`min-w-[36px] min-h-[36px] border border-[#FCD378]  flex items-center justify-center mx-2 rounded cursor-pointer
                    ${current_page === index+1 ? "bg-[#FCD378] text-[#000000] ":"bg-transparent"}
                `}
                onClick={()=>updateCurrentPage(index+1)}
                > 
                <h1>{index+1}</h1>
                </div>
                
              ))}
              </div>
            <button className={`size-6 rounded-sm bg-[#FCD378] text-[#000000] flex justify-center items-center  ${current_page === total_pages ? "opacity-30 cursor-not-allowed":"cursor-pointer"}`} disabled={current_page === total_pages} 
              onClick={onClickNext}
             
            >
              <GrFormNext />
            </button>
          </div>
          )}
        </div>
      </div>

      <div
        style={{ backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: 'no-repeat' }}
        className="overflow-hidden relative bg-center bg-cover "
      >
        <Footer />
      </div>
    </div>
  );
};

export default Activity;
