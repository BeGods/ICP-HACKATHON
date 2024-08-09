import React from "react";

const symbols = {
  celtic: 2,
  egyptian: 1,
  greek: 4,
  norse: 5,
};

const ConvertInfo = () => {
  return (
    <div className="relative w-full h-full font-montserrat text-card">
      <img
        src="/assets/cards/320px-info_background_tiny.png"
        alt="card"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 w-full text-center text-[22px] font-bold mt-2">
        CONVERSION
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col -mt-4">
          {Object.entries(symbols).map(([key, value], index) => (
            <React.Fragment key={key}>
              <div className="flex justify-center items-center gap-x-3 mt-2">
                <div
                  className={`flex relative text-center justify-center items-center w-[45px] rounded-full glow-icon-${key}`}
                >
                  <img
                    src="/assets/myths-orbs/orb.base-tiny.png"
                    alt={`${key} orb`}
                    className={`filter-orbs-${key}`}
                  />
                  <span
                    className={`absolute z-1 text-[30px] flex justify-center items-center font-symbols text-white ${
                      key === "egyptian" && "ml-[2px]"
                    } ${key === "greek" && "ml-[7px]"} ${
                      value === 3 && "ml-[4px] mb-[4px]"
                    }`}
                  >
                    {value}
                  </span>
                </div>

                <h1 className="text-[30px] font-medium">
                  {value != 3 ? "+" : "|"}
                </h1>
                <div
                  className={`flex relative text-center justify-center items-center w-[45px] rounded-full glow-icon-${key}`}
                >
                  <img
                    src="/assets/myths-orbs/orb.base-tiny.png"
                    alt={`${key} orb`}
                    className={`filter-orbs-${key}`}
                  />
                  <span
                    className={`absolute z-1 text-[30px] justify-center items-center font-symbols text-white ${
                      key === "egyptian" && "ml-[2px]"
                    } ${key === "greek" && "ml-[7px]"} ${
                      value === 3 && "ml-[4px] mb-[4px]"
                    }`}
                  >
                    {value}
                  </span>
                </div>
                <h1 className="text-[30px] font-medium">=</h1>
                <div
                  className={`flex relative text-center justify-center items-center w-[40px] -mt-1 rounded-full`}
                >
                  <img
                    src="/assets/myths-orbs/orb.multicolor-tiny.png"
                    alt="multi orb"
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConvertInfo;
