import { useState } from "react";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../../utils/useAuthClient";
import { transferApprove } from "../../utils/transApprove";
import { toast } from "react-toastify";

const NFTBtn = ({ tokenId, collectionId, amount, handleRevealNFT }) => {
  const { backendActor, isAuthenticated, principal, ledgerActor } = useAuth({});
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [showError, setShowError] = useState({ show: false, msg: "" });

  const handleClick = async () => {
    setShowError({ show: false, msg: "" });
    console.log("isAuthenticated", isAuthenticated);

    // not authenticated
    if (!isAuthenticated) {
      toast.error("Login First!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // missing fields
    if (!tokenId || !collectionId || !amount) {
      toast.error("Missing required purchase information!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      setLoadingFirst(true);
      setLoadingSecond(false);

      console.log("Starting purchase for tokenId:", tokenId);
      console.log("Purchase parameters:", {
        collectionId,
        tokenId,
        price: amount,
        principal,
      });

      const purchaseResult = await backendActor?.purchaseNft(
        collectionId,
        tokenId,
        parseInt(amount),
        principal
      );

      if (!purchaseResult?.ok) {
        throw new Error(purchaseResult?.err || "Purchase initiation failed");
      }

      setLoadingFirst(false);
      setLoadingSecond(true);

      const transactionId = purchaseResult.ok[0];
      const subAccount = [];

      console.log("Payment address received:", transactionId);

      const transferResult = await transferApprove(
        backendActor,
        ledgerActor,
        parseFloat(amount),
        Principal.fromText(principal),
        transactionId,
        collectionId,
        subAccount
      );

      console.log("Transfer result:", transferResult);

      if (transferResult === true) {
        setLoadingSecond(false);

        handleRevealNFT();

        toast.success("Payment Success!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        throw new Error(transferResult?.error || "Payment failed");
      }
    } catch (error) {
      console.error("Purchase error:", JSON.stringify(error));

      setLoadingFirst(false);
      setLoadingSecond(false);

      const errorMessage =
        error.message || "Purchase failed. Please try again.";
      setShowError({ show: true, msg: errorMessage });

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const isLoading = loadingFirst || loadingSecond;
  const buttonText = isLoading
    ? loadingFirst
      ? "Initiating..."
      : "Processing Payment..."
    : "Buy Now";

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-2 px-4 h-fit rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {buttonText}
      </button>

      {/* {showError.show && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {showError.msg}
        </div>
      )} */}
    </div>
  );
};

export default NFTBtn;
