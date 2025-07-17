import { useContext } from "react";
import { RorContext } from "../../context/context";

export const CitadelGuide = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center z-50">
      <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-[3rem] leading-10">
          <span className={`font-symbols  text-[50px] lowercase pt-2 pb-4`}>
            "
          </span>
          <div>Citadel</div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
      >
        <div className="font-symbols text-white text-[5rem] left-0 mt-[2vh] ml-[40vw] text-black-contour scale-point">
          b
        </div>
      </div>
      <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
          Mint/Trade <span className="text-gold">Artifacts</span>
        </div>
      </div>
    </div>
  );
};

export const BankGuide = ({ handleClick, currTut }) => {
  return (
    <>
      {currTut === 0 ? (
        <div className="fixed inset-0 flex flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols  text-[50px] pt-2 pb-4`}>A</span>
              <div>
                <span className="text-gold">sell</span> <span>Artifacts</span>
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          >
            <div className="font-symbols text-black-contour absolute text-white text-[5rem] cursor-pointer drag-hand">
              b
            </div>
          </div>
          <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              Earn <span className="text-gold">$Gobcoin</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols  text-[50px] pt-2 pb-4`}>,</span>
              <div>
                <span className="text-gold">BUY</span> <br />
                CHESTS
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          >
            <div className="font-symbols absolute text-white text-black-contour text-[5rem] cursor-pointer scale-point -mt-[30vh] ml-[70vw]">
              b
            </div>
          </div>
          <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              KEEP <span className="text-gold">items</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const FurnaceGuide = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center z-50">
      <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10  w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-[3rem] leading-10">
          <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
            h
          </span>
          <div>
            <span className="text-gold">drop</span> <span>fragments</span>
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
      >
        <div className="font-symbols text-black-contour absolute text-white text-[5rem] cursor-pointer drag-hand">
          b
        </div>
      </div>
      <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
          forge <span className="text-gold">artifact</span>
        </div>
      </div>
    </div>
  );
};

export const LibraryGuide = ({ handleClick, currTut }) => {
  return (
    <>
      {currTut == 0 ? (
        <div className="fixed inset-0 flex flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
                +
              </span>
              <div>
                <span className="text-gold">read</span> <br />{" "}
                <span>books</span>
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          ></div>
          <div className="h-[13%] maximize flex justify-center items-end  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              discover <span className="text-gold">artifacts</span>
            </div>
          </div>
        </div>
      ) : currTut == 1 ? (
        <div className="fixed inset-0 flex flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
                *
              </span>
              <div>
                <span className="text-gold">read</span> <br /> <span>maps</span>
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          ></div>
          <div className="h-[13%] maximize flex justify-center items-end  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              discover <span className="text-gold">locations</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols text-[50px] pt-2 pb-4`}>Y</span>
              <div>
                <span className="text-gold">CONSULT</span> <br />{" "}
                <span>TOTEM</span>
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          ></div>
          <div className="h-[13%] maximize flex justify-center items-end  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              EXPLORE <span className="text-gold">UNDERWORLD</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ApothecaryGuide = ({ handleClick, currTut }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center z-50">
      <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-[3rem] leading-10">
          <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
            v
          </span>
          <div>
            <span className="text-gold">trade</span> <br /> <span>shards</span>
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
      ></div>
      <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
          buy <span className="text-gold">potions</span>
        </div>
      </div>
    </div>
  );
};

export const TavernGuide = ({ handleClick, currTut }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center z-50">
      <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-[3rem] leading-10">
          <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
            +
          </span>
          <div>
            <span className="text-gold">rest</span> <br /> <span>here</span>
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
      ></div>
      <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
          choose <span className="text-gold">services</span>
        </div>
      </div>
    </div>
  );
};

export const ExploreGuide = ({ handleClick, currTut, Header }) => {
  const { isTgMobile, assets } = useContext(RorContext);
  return (
    <>
      {currTut == 0 ? (
        <div className="fixed inset-0 flex flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
                5
              </span>
              <div>
                <span className="text-gold">explore</span> <br />{" "}
                <span>location</span>
              </div>
            </div>
          </div>

          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          >
            <span className="font-symbols lowercase text-[6rem] scale-point absolute text-black-contour ml-[40vw]">
              b
            </span>
          </div>
          <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              collect <span className="text-gold">items</span>
            </div>
          </div>
        </div>
      ) : currTut == 1 ? (
        <div className="fixed inset-0 flex backdrop-blur-sm bg-black/50 flex-col items-center z-50">
          <div className="h-[13%] w-screen">
            <div className="flex h-button-primary mt-[2.5vh] absolute z-20 text-black font-symbols justify-between w-screen">
              <div
                className={`flex cursor-pointer  header-shadow-black p-0.5 justify-end items-center w-[32%] bg-white rounded-r-full`}
              >
                <div className={`text-[2rem] font-medium font-fof px-1`}>0</div>
                <div
                  className={`flex justify-center items-center bg-black  text-white w-[3rem] h-[3rem] aspect-square text-symbol-sm rounded-full`}
                >
                  <div className={`tut-shake`}>b</div>
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          >
            <span className="font-symbols lowercase text-[6rem] swipe-dig-hand absolute text-black-contour mb-[20vh] ml-[30vw]">
              b
            </span>
          </div>
          <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              SWIPE <br /> <span className="text-gold">TO DIG</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex backdrop-blur-sm bg-black/50 flex-col items-center z-50">
          <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            <div className="flex flex-col text-[3rem] leading-10">
              <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
                5
              </span>
              <div>
                <span className="text-gold">play</span>
                <br />
                <span>3 rounds</span>
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow justify-center w-full items-center z-[99] text-white "
          >
            <div
              className={`card ${
                isTgMobile ? "h-[45.35vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]"
              }`}
            >
              <div
                onClick={handleClick}
                className="flex flex-col relative flex-grow w-[80%] mx-auto justify-center text-center items-center z-[99] text-white "
              >
                <div className="flex justify-between gap-x-6 items-center w-[90%]">
                  <div className={`text-[3rem] text-white/30 font-symbols`}>
                    5
                  </div>
                  <div className="text-[2rem] w-full text-left uppercase">
                    unplayed
                  </div>
                </div>
                <div className="flex justify-between gap-x-6 items-center w-[90%]">
                  <div
                    className={`text-[3rem] glow-text-gold text-white font-symbols`}
                  >
                    5
                  </div>
                  <div className="text-[2rem] w-full text-left uppercase">
                    Ongoing
                  </div>
                </div>
                <div className="flex justify-between gap-x-6 items-center w-[90%]">
                  <div className={`text-[3rem] text-gold font-symbols`}>5</div>
                  <div className="text-[2rem] w-full text-left uppercase">
                    Won
                  </div>
                </div>
                <div className="flex justify-between gap-x-6 items-center w-[90%]">
                  <div
                    className={`text-[3rem] text-white text-black-contour font-symbols`}
                  >
                    5
                  </div>
                  <div className="text-[2rem] w-full text-left uppercase">
                    lost
                  </div>
                </div>
                <div className="flex justify-between gap-x-6 items-center w-[90%]">
                  <div className={`text-[3rem] text-white/30 font-symbols`}>
                    *
                  </div>
                  <div className="text-[2rem] w-full text-left uppercase">
                    Extra Round
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
              MAX <br /> <span className="text-gold">12 TURNS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// <div className="fixed inset-0 flex backdrop-blur-sm bg-black/50 flex-col items-center z-50">
//   <div className="h-[20%] maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
//     <div className="flex flex-col text-[3rem] leading-10">
//       <span className={`font-symbols lowercase text-[50px] pt-2 pb-4`}>
//         5
//       </span>
//       <div>
//         <span className="text-gold">extra</span>
//         <br />
//         <span>boosts</span>
//       </div>
//     </div>
//   </div>
//   <div
//     onClick={handleClick}
//     className="flex relative flex-grow justify-center w-full items-center z-[99] text-white "
//   >
//     <div
//       className={`card ${
//         isTgMobile ? "h-[45.35vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]"
//       }`}
//     >
//       <div
//         onClick={handleClick}
//         className="flex flex-col relative flex-grow w-[80%] mx-auto justify-center text-center items-center z-[99] text-white "
//       >
//         <div className="flex justify-between gap-x-6 items-center w-[100%]">
//           <div
//             className={`text-[3rem] text-gold text-black-contour font-symbols`}
//           >
//             a
//           </div>
//           <div className="text-[1.5rem] w-full uppercase">
//             to underworld
//           </div>
//         </div>
//         <div className="flex justify-between gap-x-6 items-center w-[100%]">
//           <div
//             className={`text-[3rem] text-gold text-black-contour font-symbols`}
//           >
//             Z
//           </div>
//           <div className="text-[1.5rem] w-full uppercase">
//             to underworld
//           </div>
//         </div>
//         <div className="flex justify-between gap-x-6 items-center w-[100%]">
//           <div
//             className={`text-[3rem] text-gold text-black-contour font-symbols`}
//           >
//             *
//           </div>
//           <div className="text-[1.5rem] w-full uppercase">
//             extra round
//           </div>
//         </div>
//         <div className="flex justify-between gap-x-6 items-center w-[100%]">
//           <div
//             className={`text-[3rem] text-gold text-black-contour font-symbols`}
//           >
//             Y
//           </div>
//           <div className="text-[1.5rem] w-full uppercase">
//             extra round in (IN)
//           </div>
//         </div>
//         <div className="flex justify-between gap-x-6 items-center w-[100%]">
//           <div
//             className={`text-[3rem] text-gold text-black-contour font-symbols`}
//           >
//             F
//           </div>
//           <div className="text-[1.5rem] w-full uppercase">
//             extra turn
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="h-[13%] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
//     <div className="flex flex-col justify-center items-center text-primary break-words leading-10">
//       <br /> <span className="text-gold"></span>
//     </div>
//   </div>
// </div>
