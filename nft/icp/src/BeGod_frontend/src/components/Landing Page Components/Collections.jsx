import React from 'react';

const Collections = () => {
  return (
    <div className='w-[100%] sm:w-[80%] sm:ml-[10%] sm:mt-24'>
      <h1 style={{ fontFamily: "QuickSand" }} className="text-white text-2xl font-medium h-[5vh] w-full flex items-center justify-center">
        Collections
      </h1>
      <div className='flex flex-wrap sm:flex-row justify-center gap-8 items-center mt-8'>
        {/* Norse Collection */}
        <div className='relative w-[42%] sm:w-[25%] md:w-[18%] h-[8vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-r hover:from-[#4A4A4A] hover:via-[#6272a4] hover:to-[#282a36] border-2 border-transparent hover:border-transparent hover:bg-transparent'>
          <div className='absolute inset-0 border border-transparent hover:border-[3px] hover:border-gradient-to-r hover:from-[#6272a4] hover:via-[#bd93f9] hover:to-[#50fa7b] rounded-lg transition-all duration-500 ease-in-out'></div>
          <img src="/image/col1.png" alt="" className='h-[80%] z-10' />
          <h1 className='text-lg font-[400] text-[#FFFFFF] z-10'>Norse</h1>
        </div>
        {/* Celtic Collection */}
        <div className='relative w-[42%]  sm:w-[25%] md:w-[18%] h-[8vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-r hover:from-[#4A4A4A] hover:via-[#50C878] hover:to-[#2E8B57] border-2 border-transparent hover:border-transparent hover:bg-transparent'>
          <div className='absolute inset-0 border border-transparent hover:border-[3px] hover:border-gradient-to-r hover:from-[#50C878] hover:via-[#3cb371] hover:to-[#2E8B57] rounded-lg transition-all duration-500 ease-in-out'></div>
          <img src="/image/col2.png" alt="" className='h-[80%] z-10' />
          <h1 className='text-lg font-[400] text-[#FFFFFF] z-10'>Celtic</h1>
        </div>
        {/* Greek Collection */}
        <div className='relative w-[42%]  sm:w-[25%] md:w-[18%] h-[8vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-r hover:from-[#4A4A4A] hover:via-[#FFD700] hover:to-[#FF6347] border-2 border-transparent hover:border-transparent hover:bg-transparent'>
          <div className='absolute inset-0 border border-transparent hover:border-[3px] hover:border-gradient-to-r hover:from-[#FFD700] hover:via-[#FF4500] hover:to-[#FF6347] rounded-lg transition-all duration-500 ease-in-out'></div>
          <img src="/image/col4.png" alt="" className='h-[80%] z-10' />
          <h1 className='text-lg font-[400] text-[#FFFFFF] z-10'>Greek</h1>
        </div>
        {/* Egyptian Collection */}
        <div className='relative w-[42%]  sm:w-[25%] md:w-[18%] h-[8vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-r hover:from-[#4A4A4A] hover:via-[#8B4513] hover:to-[#D2691E] border-2 border-transparent hover:border-transparent hover:bg-transparent'>
          <div className='absolute inset-0 border border-transparent hover:border-[3px] hover:border-gradient-to-r hover:from-[#8B4513] hover:via-[#A0522D] hover:to-[#D2691E] rounded-lg transition-all duration-500 ease-in-out'></div>
          <img src="/image/col3.png" alt="" className='h-[80%] z-10' />
          <h1 className='text-lg font-[400] text-[#FFFFFF] z-10'>Egyptian</h1>
        </div>
      </div>
    </div>
  );
}

export default Collections;
