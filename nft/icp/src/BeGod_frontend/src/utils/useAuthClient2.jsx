import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";

// Create the Auth context
const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // set to 30 minutes
      disableDefaultIdleCallback: true,
    },
  },
  loginOptionsIcp: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#"
        : `http://localhost:4943/`,
  },
  loginOptionsNfid: {
    identityProvider: `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
   
    AuthClient.create(options.createOptions).then((client) => {
      setAuthClient(client);
    });
  }, [dispatch]);
  const backendCanisterId = process.env.CANISTER_ID_BEGOD_BACKEND;

  const login = (val) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (authClient?.isAuthenticated() && !(await authClient.getIdentity().getPrincipal().isAnonymous())) {
          // Update the client with backendActor
          updateClient(authClient);
          resolve(AuthClient);
        } else {
          let opt = val === "Identity" ? "loginOptionsIcp" : "loginOptionsNfid";
          authClient.login({
            ...options[opt],
            onError: (error) => reject(error),
            onSuccess: () => {
              updateClient(authClient);
              resolve(authClient);
            },
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleLogin = async (provider) => {
    try {
      let userObject;
      if (provider === "Plug") {
        userObject = await PlugLogin([backendCanisterId]);
      } else if (provider === "Stoic") {
        userObject = await StoicLogin();
      } else if (provider === "NFID") {
        userObject = await NFIDLogin();
      } else if (provider === "Identity") {
        userObject = await IdentityLogin();
      }

      if (userObject.agent?._isAgent || userObject.agent?.agent?._isAgent) {
        setPrincipal(userObject.principal);
        const authData = {
          isAuthenticated: true,
          user: userObject.principal,
          identity: userObject.identity,
        };
        localStorage.setItem("auth", JSON.stringify(authData)); // Save authentication state to localStorage

        dispatch(setUser(userObject.principal)); // Set Redux user state
        navigate("/admin/dashboard");
      } else {
        console.warn("Login was unsuccessful.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  async function updateClient(client) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);
    const identity = client.getIdentity();
    setIdentity(identity);
    const principal = identity.getPrincipal();
    setPrincipal(principal);
    setAuthClient(client);
  }

  async function logout() {
    await authClient?.logout();
    await updateClient(authClient);
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    window.location.href = '/admin/login';
  }

  return {
    login,
    logout,
    principal,
    isAuthenticated,
    setPrincipal,
    identity,
    backendActor,
    handleLogin,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
