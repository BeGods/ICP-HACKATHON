import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function DashBoard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth); 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  

  return (
    <div className='bg-contain text-white mx-auto text-center w-[90%] h-full px-6 sm:px-12 md:px-24 pt-5 sm:pt-6 md:pt-16 lg:pt-28'>
      <div className='grid justify-center grid-cols-1 gap-8 mx-auto lg:text-2xl sm:grid-cols-4 max-w-screen-2xl font-Quicksand sm:font-bold md:text-xl sm:text-lg'>
        <div className='bg-[#29292C] px-6 py-4 col-span-2 h-32 2xl:h-52 flex flex-col justify-center rounded-md'>
          <h3>Total Collections</h3>
          <p>2</p>
        </div>
        <div className='bg-[#29292C] px-6 py-4 col-span-2 h-32 2xl:h-52 flex flex-col justify-center rounded-md'>
          <h3>Total NFTs</h3>
          <p>2</p>
        </div>
        <div className='bg-[#29292C] px-6 py-4 col-span-2 sm:col-start-2 sm:col-end-4 h-32 2xl:h-52 flex flex-col justify-center rounded-md'>
          <h3>Total Users</h3>
          <p>1</p>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
