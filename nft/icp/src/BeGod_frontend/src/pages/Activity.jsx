import React, { useEffect, useState, useMemo } from 'react';

import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../utils/useAuthClient';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ReactTimeAgo from 'react-time-ago';
import { useNavigate } from 'react-router-dom';

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

  // Fetch user activity
  useEffect(() => {
    fetchUserActivity();
  }, []);

  const fetchUserActivity = async () => {
    try {
      const actList = [];

      console.log('collections list', collections);

      const activityPromises = collections.map(async (collection) => {
        const result = await backendActor?.useractivity(collection.collectionId, principal);

        return result?.map((eachItem) => {
          const timeInMilliSeconds = Number(eachItem[2].time) / 1000000;
          return {
            collectionName: eachItem[3],
            tokenId: eachItem[1],
            price: Number(eachItem[2].price) / 100000000,
            time: new Date(timeInMilliSeconds),
            buyStatus: eachItem[4], 
          };
        });
      });

    
      const resolvedActivities = await Promise.all(activityPromises);

    
      const allActivities = resolvedActivities.flat();

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
        <div className="p-[10px] min-h-[70vh] w-full lg:p-[70px] ">
          <h1 className="text-3xl text-center mb-3 lg:text-5xl text-[#FCD378] lg:mb-5 lg:text-start">Activity</h1>
          <ul className="w-[100%] h-[50px] lg:h-[40px] text-[#FCD378] text-sm lg:text-lg bg-[#FCD37B1A] m-0 pl-[20px] lg:pl-[180px] grid grid-cols-4 items-center mb-[21px]">
            <li>Collection Name</li>
            <li>Token Id</li>
            <li>Price</li>
            <li>Time</li>
          </ul>
          <div>
            {loading ? (
              <SkeletonTheme baseColor="#FCD37B1A" highlightColor="#FCD37B1A">
                <div className="flex flex-col space-y-2 w-full">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      count={1}
                      width="100%" // Set width to 100%
                      height={100}
                      duration={2}
                      className="opacity-25"
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
                  className="w-[100%] h-[75px] lg:h-[100px] text-[#FCD378] text-sm bg-[#FCD37B1A] m-0  pl-[20px] lg:pl-[180px] grid grid-cols-4 items-center mb-[21px] overflow-x-auto"
                >
                  <li>{eachActivity.collectionName}</li>
                  <li>
                    {eachActivity.tokenId.slice(0, 5)}.....{eachActivity.tokenId.slice(-4)}
                  </li>
                  <li>{eachActivity.price} ICP</li>
                  <ul>
                    <li>{eachActivity.buyStatus}</li>
                    <li>
                      <ReactTimeAgo date={eachActivity.time} locale="en" />
                    </li>
                  </ul>
                </ul>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        style={{ backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: 'no-repeat' }}
        className="overflow-hidden relative bg-center bg-cover"
      >
        <Footer />
      </div>
    </div>
  );
};

export default Activity;
