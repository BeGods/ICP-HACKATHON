import { useEffect, useState } from "react";

const CreditsScroll = () => {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <div
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
      className="relative w-full bg-black overflow-hidden flex items-center justify-center"
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black to-transparent"></div>
      <div className="perspective-[450px] pt-20 w-full mx-auto">
        <div
          className={`text-yellow-400 text-3xl w-[90%] mx-auto font-bold text-justify relative ${
            animation ? "animate-scroll" : ""
          }`}
        >
          <h1 className="text-center text-5xl font-extrabold mb-4">
            STAR WARS
          </h1>
          <h2 className="text-center text-3xl mb-6">Scrolling Text Effect</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad maiores
            aut cupiditate unde ipsam ut fugit deleniti non autem...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditsScroll;
