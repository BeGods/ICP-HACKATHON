import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser , setUserAndStore , logoutUserAndClear} from "../redux/authSlice";
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
        : `https://identity.ic0.app/#"`,
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

  // Function to restore user session from localStorage and set Redux
  const restoreSessionFromLocalStorage = () => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth && storedAuth.isAuthenticated) {
      // If there is an authentication state in localStorage, restore it
      setIsAuthenticated(true);
      setIdentity(storedAuth.identity);
      setPrincipal(storedAuth.user);
      dispatch(setUser(storedAuth.user)); // Restore user to Redux
    }
  };

  useEffect(() => {
    restoreSessionFromLocalStorage();
    AuthClient.create(options.createOptions).then((client) => {
      setAuthClient(client);
    });
  }, [dispatch]);
  const backendCanisterId = process.env.CANISTER_ID_BEGOD_BACKEND;

  const login = async(provider) => {
    try {
      let userObject;

      // Login using different providers
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
        createActorBackend(userObject.agent);
        const backendActor = createActorBackend(backendCanisterId, {
          agentOptions: { identity: identity },
        });
        setBackendActor(backendActor);
        setIsAuthenticated(true);
        // updateClient(userObject);
        dispatch(setUserAndStore(userObject.principal));
        navigate("/");
      } else {
        console.warn("Login was unsuccessful.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // const createTokenActor = (canisterId) => {
  //     if(!canisterId){
  //         throw new Error("Canister ID is undefined");
  //     }
  //     const agent = new HttpAgent();
  //     let tokenActor = createActor(TokenIdl, {
  //         agent,
  //         canisterId: canisterId,
  //     });
  //     return tokenActor;
  // };

    // const canisterId = process.env.CANISTER_ID_CKETH_LEDGER

  const reloadLogin = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient?.isAuthenticated() &&
          (await authClient.getIdentity().getPrincipal().isAnonymous()) ===
            false
        ) {
          updateClient(authClient);
          resolve(AuthClient);
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
        createActorBackend(userObject.agent);
        const backendActor = createActorBackend(backendCanisterId, {
          agentOptions: { identity: identity },
        });
        setBackendActor(backendActor);
        setIsAuthenticated(true);
        // updateClient(userObject);
        dispatch(setUser(userObject.principal));
        navigate("/");
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
    dispatch(logoutUserAndClear());
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
    reloadLogin,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
