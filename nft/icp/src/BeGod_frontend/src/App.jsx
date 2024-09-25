import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Admin/Admin";
import Login from "./Admin/Login";
import Profile from "./pages/Profile";
import CollectionDetail from "./pages/CollectionDetail";
import NftDetails from "./components/NftDetails";
import Hero from "./pages/Hero";
import BuyNft from "./pages/BuyNft";
import PageNotFound from "./Admin/PageNotFound";
import Activity from "./pages/Activity";
import FullpageLoader from "./Loader/FullpageLoader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FullpageLoader />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/collection/:collectionName" element={<CollectionDetail />} />
        <Route path="/Nft/:Nftname" element={<NftDetails />} />
        <Route path="/Nft/:Nftname/buy" element={<BuyNft />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
