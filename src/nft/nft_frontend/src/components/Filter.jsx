import { useState } from "react";
import { SlidersHorizontal, ChevronDown, Check, Search } from "lucide-react";

const FilterComp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("icp");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    {
      value: "icp",
      icon: "https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/icp-logo.png",
      label: "ICP",
    },
    {
      value: "kaia",
      icon: "https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/kaia.logo.small.png",
      label: "Kaia",
    },
  ];

  const selectedOption = sortOptions.find((option) => option.value === sortBy);

  const handleSortChange = (value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex gap-x-3 text-sm">
      {/* <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-8 py-3 bg-[#161616] border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none transition-all duration-200 backdrop-blur-sm"
        />
      </div> */}

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {isDropdownOpen && (
        <div className="absolute top-full mt-2 ml-[18vw] bg-[#161616] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
          <div className="">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-150 ${
                  sortBy === option.value
                    ? "bg-gray-800 text-gray-100"
                    : "text-gray-300"
                }`}
              >
                <img
                  src={option.icon}
                  alt={option.label}
                  className="w-4 h-auto"
                />
                <span className="uppercase pl-2">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-3 py-2 bg-[#161616] border border-gray-700 rounded-xl text-gray-100 hover:bg-gray-800 focus:outline-none transition-all duration-200 backdrop-blur-sm min-w-[200px]"
        >
          <img
            src={selectedOption?.icon}
            alt="blockchain"
            className="w-6 h-6"
          />
          <span className="flex-1 text-left">{selectedOption?.label}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default FilterComp;
