import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentNFTData = [],
}) => {
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    rarity: true,
    artist: true,
  });

  // Extract unique values from NFT data
  const [availableRarities, setAvailableRarities] = useState([]);
  const [availableArtists, setAvailableArtists] = useState([]);

  useEffect(() => {
    if (currentNFTData.length > 0) {
      // Extract unique rarities
      const rarities = [
        ...new Set(currentNFTData.map((nft) => nft.rarity).filter(Boolean)),
      ];
      setAvailableRarities(rarities);

      // Extract unique artists
      const artists = [
        ...new Set(
          currentNFTData.map((nft) => nft.arstistname).filter(Boolean)
        ),
      ];
      setAvailableArtists(artists);
    }
  }, [currentNFTData]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRarityChange = (rarity) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    );
  };

  const handleArtistChange = (artist) => {
    setSelectedArtists((prev) =>
      prev.includes(artist)
        ? prev.filter((a) => a !== artist)
        : [...prev, artist]
    );
  };

  const handleApplyFilters = () => {
    const filters = {
      sortBy,
      sortOrder,
      rarities: selectedRarities,
      artists: selectedArtists,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleClearAll = () => {
    setSortBy("");
    setSortOrder("asc");
    setSelectedRarities([]);
    setSelectedArtists([]);
  };

  const hasActiveFilters =
    sortBy || selectedRarities.length > 0 || selectedArtists.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              Filter
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <button
              onClick={() => toggleSection("sort")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white">Sort By</h3>
              {expandedSections.sort ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.sort && (
              <div className="space-y-3 pl-2">
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="sort"
                      value="price"
                      checked={sortBy === "price"}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-600 bg-gray-700 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">Price</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="sort"
                      value="rarity"
                      checked={sortBy === "rarity"}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-600 bg-gray-700 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">Rarity</span>
                  </label>
                </div>

                {sortBy && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSortOrder("asc")}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        sortOrder === "asc"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Low to High
                    </button>
                    <button
                      onClick={() => setSortOrder("desc")}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        sortOrder === "desc"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      High to Low
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => toggleSection("rarity")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white">
                Rarity
                {selectedRarities.length > 0 && (
                  <span className="ml-2 text-sm text-indigo-400">
                    ({selectedRarities.length})
                  </span>
                )}
              </h3>
              {expandedSections.rarity ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.rarity && (
              <div className="space-y-2 pl-2 max-h-40 overflow-y-auto">
                {availableRarities.length > 0 ? (
                  availableRarities.map((rarity) => (
                    <label key={rarity} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedRarities.includes(rarity)}
                        onChange={() => handleRarityChange(rarity)}
                        className="w-4 h-4 text-indigo-600 border-gray-600 bg-gray-700 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-300 capitalize">{rarity}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No rarities available</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => toggleSection("artist")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-white">
                Artist
                {selectedArtists.length > 0 && (
                  <span className="ml-2 text-sm text-indigo-400">
                    ({selectedArtists.length})
                  </span>
                )}
              </h3>
              {expandedSections.artist ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.artist && (
              <div className="space-y-2 pl-2 max-h-40 overflow-y-auto">
                {availableArtists.length > 0 ? (
                  availableArtists.map((artist) => (
                    <label key={artist} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedArtists.includes(artist)}
                        onChange={() => handleArtistChange(artist)}
                        className="w-4 h-4 text-indigo-600 border-gray-600 bg-gray-700 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{artist}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No artists available</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-700">
          <button
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
