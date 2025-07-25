import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "./SideBar";
import DashBoard from "./DashBoard";
import Collection from "./collection/Collection";
import Users from "./Users";
import CollectionDetails from "./collection/CollectionDetails";
import NftDetails from "./collection/NftDetails";
import CreateCollection from "./collection/CreateCollection";
import UserDetails from "./UserDetails";
import PageNotFound from "./PageNotFound";
import Useractivity from "./Useractivity";
import Allorder from "./Allorder";
import AllorderDetails from "./AllorderDetails";
import UnauthorizedPage from "./collection/UnauthorizedPage";
import { canisterId } from "../../../declarations/BeGod_backend";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../utils/useAuthClient.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { backendActor, principal } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Prevent duplicate calls in React Strict Mode
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Function to check admin ID
  const checkingAdminId = async () => {
    setLoading(true);

    if (backendActor) {
      try {
        const canister = Principal.fromText(canisterId);
        const principalid = Principal.fromText(principal);
        const result = await backendActor.isController(canister, principalid);

        if (result === true) {
          toast.success("Admin login successful");
          navigate("/admin/dashboard");
        } else {
          toast.error("Only admin can access");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin ID:", error);
        toast.error("Error checking admin ID:", error);
        navigate("/admin/login");
      } finally {
      }
    }
  };

  useEffect(() => {
    // Prevent duplicate calls in development mode
    if (isInitialRender) {
      setIsInitialRender(false);
      checkingAdminId();
    }
  }, [isInitialRender]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 border-8 border-gray-700 border-t-gray-400 rounded-full animate-spin"></div>
          <p className="mt-2 text-2xl font-medium text-white">
            Please wait while we verify your admin ID...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-start justify-center lg:flex-row md:flex-row sm:flex-col admin-control-font"
      style={{ fontFamily: "sans-serif !important" }}
    >
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex items-center justify-center w-full">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/create" element={<CreateCollection />} />
          <Route
            path="/collection/collectionDetails/:id"
            element={<CollectionDetails />}
          />
          <Route
            path="/collection/collectionDetails/:collectionId/nft/:nftId"
            element={<NftDetails />}
          />
          <Route path="/users/" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/activity" element={<Useractivity />} />
          <Route path="/activity/allorder/" element={<Allorder />} />
          <Route path="/activity/allorder/:id" element={<AllorderDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
