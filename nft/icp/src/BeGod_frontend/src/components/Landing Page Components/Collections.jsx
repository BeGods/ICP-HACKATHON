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
    <div className='w-full sm:w-4/5 sm:ml-[10%] mt-8 sm:mt-32 md:mt-48'>
      <h1 style={{ fontFamily: "QuickSand" }} className="text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-medium h-[5vh] w-full flex items-center justify-center">
        Collections
      </h1>
      <div className='flex flex-wrap lg:flex-row justify-center gap-8 items-center mt-8'>
        {collections.map((collection, index) => (
          <Link
            key={index}
            to={`/collection/${collection.name}`}
            className='z-100 group relative w-[42%] sm:w-[25%] lg:w-[18%] h-[8vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-transparent'
            style={{ position: 'relative' }} // Ensure parent is positioned
          >
            {/* Smoke Effect on Hover */}
            <div
              className='w-[90%] h-[90%] absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 smoke-shift group-hover:animate-[smoke_2s_infinite_alternate]'
              style={{
                boxShadow: `0 0 30px 10px ${collection.shadowColor}`,
              }}
            ></div>
            {/* Collection Image */}
            <img src={collection.imgSrc} alt={collection.name} className='h-[80%] z-10' />
            {/* Collection Name */}
            <h1 className='text-lg font-[400] text-white z-10'>{collection.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
