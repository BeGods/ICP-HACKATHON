import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NFTReveal = ({ cardImg, tokenId, handleClose }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  const createParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 1000,
        duration: Math.random() * 2000 + 2000,
      });
    }
    setParticles(newParticles);
  };

  const handleReveal = () => {
    setIsRevealing(true);
    createParticles();

    let intensity = 0;
    const glowInterval = setInterval(() => {
      intensity += 5;
      setGlowIntensity(intensity);
      if (intensity >= 100) {
        clearInterval(glowInterval);

        setTimeout(() => {
          setCardRevealed(true);
        }, 500);
      }
    }, 50);
  };

  useEffect(() => {
    setTimeout(() => {
      handleReveal();
    }, 1000);
  }, []);

  return (
    <div className="fixed inset-0  w-screen bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4 no-scrollbar">
      <div className="min-h-screen bg-gradient-to-br w-full from-slate-900  flex items-center justify-center p-4 relative overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}ms ease-in-out infinite ${particle.delay}ms`,
            }}
          />
        ))}

        <div className="relative z-10">
          {isRevealing && !cardRevealed && (
            <div className="text-center">
              <div className="relative">
                <div
                  className="w-64 h-80 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl transition-all duration-100"
                  style={{
                    opacity: glowIntensity / 100,
                    transform: `scale(${1 + glowIntensity / 200})`,
                  }}
                ></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 border-2 border-white/30 rounded-full animate-ping"></div>
                </div>
              </div>

              <p className="text-white text-xl mt-8 animate-pulse">
                Revealing your NFT...
              </p>
            </div>
          )}

          {cardRevealed && (
            <div className="text-center">
              <div className="relative">
                <div
                  className="max-w-72 mx-auto transform transition-all duration-1000 ease-out"
                  style={{
                    animation: "cardReveal 0.5s ease-out forwards",
                  }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 animate-pulse"></div>

                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>

                  <img
                    src={cardImg}
                    alt="card"
                    className="relative h-full w-full overflow-hidden shadow-2xl rounded-3xl"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white">
                  🎉 Congratulations!
                </h2>
                <p className="text-slate-300">You now own this exclusive NFT</p>
                <p className="text-slate-400 text-sm">
                  Token ID:{" "}
                  <span className="font-mono text-white">{tokenId}</span>
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                  >
                    View NFT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
              opacity: 1;
            }
          }

          @keyframes cardReveal {
            0% {
              transform: scale(0.3) rotateY(-90deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.1) rotateY(0deg);
              opacity: 0.8;
            }
            100% {
              transform: scale(1) rotateY(0deg);
              opacity: 1;
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }

          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out 0.5s both;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NFTReveal;
