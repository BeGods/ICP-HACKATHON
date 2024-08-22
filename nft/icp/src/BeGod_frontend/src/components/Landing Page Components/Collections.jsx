import React from 'react';
import { Link } from 'react-router-dom';

const collections = [
  { name: "Norse", imgSrc: "/image/col1.png", shadowColor: "#00bfff" },
  { name: "Celtic", imgSrc: "/image/col2.png", shadowColor: "#32CD32" },
  { name: "Greek", imgSrc: "/image/col4.png", shadowColor: "#FFD700" },
  { name: "Egyptian", imgSrc: "/image/col3.png", shadowColor: "#FF4500" }
];

const Collections = () => {
  return (
    <div className='w-[100%] sm:w-[80%] sm:ml-[10%] mt-8 sm:mt-32 md:mt-48'>
      <h1 style={{ fontFamily: "QuickSand" }} className="text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-medium h-[5vh] w-full flex items-center justify-center">
        Collections
      </h1>
      <div className='flex flex-wrap lg:flex-row justify-center gap-8 items-center mt-8'>
        {collections.map((collection, index) => (
          <Link
            key={index}
            to={`/collection/${collection.name}`}
            className='group relative w-[42%] sm:w-[25%] lg:w-[18%] h-[8vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-transparent hover:bg-transparent'
          >
            <div className='smoke'></div> {/* Smoke effect */}
            <div className='absolute inset-0 rounded-lg group-hover:bg-[rgba(50,50,50,0.6)] transition-all duration-500 ease-in-out animate'></div>
            <div
              className={`absolute inset-0 bg-[rgba(0,0,0,0.3)] rounded-lg `}
              style={{ boxShadow: `0 0 30px 10px ${collection.shadowColor}` }}
            ></div>
            <img src={collection.imgSrc} alt={collection.name} className='h-[80%] z-10' />
            <h1 className='text-lg font-[400] text-[#FFFFFF] z-10'>{collection.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Collections;
