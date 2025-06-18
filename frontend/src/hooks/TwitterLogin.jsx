import { useState, useCallback } from "react";
import { getAuth, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../utils/firebase";

export const useTwitterAuth = () => {
  const auth = getAuth(firebaseApp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithTwitter = useCallback(async () => {
    setLoading(true);
    const provider = new TwitterAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const loggedInUser = result.user;
      const data = loggedInUser.reloadUserInfo?.providerUserInfo?.[0];
      const twitterUsername = data.screenName;

      if (token) {
        return { token: token, twitterUsername: twitterUsername };
      }

      return null;
    } catch (err) {
      console.error("Twitter login failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return {
    loginWithTwitter,
    loading,
    error,
  };
};
