import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
const mockProducts = [
  {
    id: 1,
    label: "ICP1",
    title: "Celtic Pack",
    subtitle: "BeGods Games",
    image: "/Hero/img1.png",
    price: "2.5 ICP",
    isVideo: false,
  },
  {
    id: 2,
    label: "ICP2",
    title: "Egyptian Pack",
    subtitle: "BeGods Games",
    image: "/Hero/img2.png",
    price: "1.8 ICP",
    isVideo: true,
  },
  {
    id: 3,
    label: "ICP3",
    title: "Greek Pack",
    subtitle: "BeGods Games",
    image: "/Hero/img3.png",
    price: "3.2 ICP",
    isVideo: false,
  },
  {
    id: 4,
    label: "ICP4",
    title: "Norse Pack",
    subtitle: "BeGods Games",
    image: "/Hero/img4.png",
    price: "4.1 ICP",
    isVideo: true,
  },
];
const Hero = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockProducts.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mockProducts.length) % mockProducts.length
    );
  };

  const currentProduct = mockProducts[currentIndex];
  return (
    <div
      className="relative w-full h-[640px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 transition-all duration-1000 ease-out">
        <img
          src={currentProduct.image}
          alt={currentProduct.title}
          className="w-full h-full object-cover scale-110 transition-transform duration-[8000ms] ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-gray-300 text-lg tracking-wider uppercase font-light">
                  {currentProduct.subtitle}
                </p>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  {currentProduct.title}
                </h1>
                <p className="text-3xl text-white/80 font-light">
                  {currentProduct.price}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95">
                  Explore Collection
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full aspect-[4/5] relative overflow-hidden">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={goToPrev}
          className="w-8 h-8 text-white/60 hover:text-white transition-all duration-300 hover:scale-125"
        >
          <ChevronLeft className="w-full h-full" />
        </button>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={goToNext}
          className="w-8 h-8 text-white/60 hover:text-white transition-all duration-300 hover:scale-125"
        >
          <ChevronRight className="w-full h-full" />
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {mockProducts.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 transition-all duration-500 ${
                index === currentIndex ? "w-12 bg-white" : "w-3 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
