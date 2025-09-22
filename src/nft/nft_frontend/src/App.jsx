import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Admin/Admin";
import Login from "./Admin/Login";
import Profile from "./app/user/Profile";
import CollectionDetail from "./pages/CollectionDetail";
import NftDetails from "./components/NftDetails";
import BuyNft from "./pages/BuyNft";
import PageNotFound from "./Admin/PageNotFound";
import Activity from "./pages/Activity";
import UnauthorizedPage from "./Admin/collection/UnauthorizedPage";
import Home from "./app/user/Home";
import { ToastContainer } from "react-toastify";

// Introduce a manual delay for testing
const simulateNetworkDelay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Lazy load the FullpageLoader with a simulated delay
const FullpageLoader = lazy(() =>
  simulateNetworkDelay(2000).then(() => import("./Loader/FullpageLoader"))
);

function App() {
  return (
    <div>
      <Suspense fallback={<FullpageLoader />}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
          <Route
            path="/collection/:collectionName"
            element={<CollectionDetail />}
          />
          <Route path="/Nft/:Nftname" element={<NftDetails />} />
          <Route path="/Nft/:Nftname/buy" element={<BuyNft />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/unauth/*" element={<UnauthorizedPage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/unauth" element={<UnauthorizedPage />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </div>
  );
}

export default App;
