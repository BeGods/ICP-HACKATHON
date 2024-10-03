import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  createActor,
  BeGod_backend,
} from "../../../declarations/BeGod_backend";
import { createActor as createLedgerActor } from "../../../declarations/icp_ledger_canister/index";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";
import { idlFactory } from "../../../declarations/BeGod_backend/index";
import { idlFactory as ledgerIdlFactory } from "../../../declarations/icp_ledger_canister/index";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { updateDisplayWalletOptionsStatus } from "../redux/infoSlice";

// Create a React context for authentication state
const AuthContext = createContext();

// Custom hook to manage authentication with Internet Identity
export const useAuthClient = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountIdString, setAccountIdString] = useState("");
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [ledgerActor, setLedgerActor] = useState(null);
  const [showButtonLoading, setShowButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 

  useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
    });
  }, [dispatch]);

  useEffect(() => {
    if (authClient) {
      updateClient(authClient);
    }
  }, [authClient]);

  const backend_id = process.env.CANISTER_ID_BEGOD_BACKEND;
  const frontend_id = process.env.CANISTER_ID_BEGOD_FRONTEND;
  const custom_token_ledger = process.env.CANISTER_ID_ICRC2_TOKEN_CANISTER;
  const ledgerCanId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  const whitelist = [backend_id,ledgerCanId,custom_token_ledger,frontend_id]

  const login = async (provider, navigatingPath) => {
    return new Promise(async (resolve, reject) => {
      setShowButtonLoading(true);
      try {
        if (
          (await authClient.isAuthenticated()) &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          updateClient(authClient);
          resolve(authClient);
        } else {
          let userObject = {
            principal: "Not Connected.",
            agent: undefined,
            provider: "",
          };
  
          if (provider === "plug") {
            console.log(window, "windows");
            // Ensure Plug is installed
            if (!window.ic?.plug) throw new Error("Plug extension not installed");
  
            const host =
              process.env.DFX_NETWORK === "ic"
                ? "https://icp-api.io"
                : "http://127.0.0.1:4943";
  
            // Check if Plug is connected
            // const isPlugConnected = await window.ic.plug.isConnected({
            //   whitelist,
            //   host,
            // });
  
            // if (!isPlugConnected) {
              // Request connection if not already connected
              const isConnected = await window.ic.plug.requestConnect({
                whitelist,
                host,
              });
  
              if (!isConnected) {
                throw new Error("Plug connection refused");
              }
            // }
  
            // Now that we are connected, fetch the identity and principal
            const principal = await window.ic.plug.agent.getPrincipal();
            console.log(principal, "principal");
  
            const user_uuid = uuidv4();
  
            // Create actor for the backend
            const userActor = await window.ic.plug.createActor({
              canisterId: process.env.CANISTER_ID_BEGOD_BACKEND,
              interfaceFactory: idlFactory,
            });
  
            // Create actor for the ledger
            const EXTActor = await window.ic.plug.createActor({
              canisterId: ledgerCanId,
              interfaceFactory: ledgerIdlFactory,
            });
  
            userObject.principal = principal.toText();
            userObject.agent = window.ic.plug.agent;
  
            console.log(userActor, "userActor");
  
            // Create user with the principal and user UUID
            const userdetails = await userActor.create_user(principal, user_uuid);
            console.log(userdetails, "userdetails");
  
            // Update the actors and state
            setBackendActor(userActor);
            setLedgerActor(EXTActor);
          } else {
            // Handle other providers (stoic, nfid, ii) as before
            if (provider === "stoic") {
              userObject = await StoicLogin();
            } else if (provider === "nfid") {
              userObject = await NFIDLogin();
            } else if (provider === "ii") {
              userObject = await IdentityLogin();
            }
  
            const identity = await userObject.agent._identity;
            const principal = Principal.fromText(userObject.principal);
  
            const agent = new HttpAgent({ identity });
  
            const backendActor = createActor(
              process.env.CANISTER_ID_BEGOD_BACKEND,
              { agentOptions: { identity, verifyQuerySignatures: false } }
            );
            const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
  
            setLedgerActor(ledgerActor1);
            setBackendActor(backendActor);
          }
  
          setPrincipal(userObject.principal);
          setIdentity(userObject.agent?._identity);
          setIsAuthenticated(true);
          dispatch(setUser(userObject.principal));
          dispatch(updateDisplayWalletOptionsStatus(false));
  
          if (navigatingPath === "/profile") {
            navigate(navigatingPath);
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setShowButtonLoading(false); // Update loading state on error
        reject(error);
      } finally {
        setShowButtonLoading(false); // Ensure button loading state is cleared
      }
    });
  };
  

  const adminlogin = async (provider) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          (await authClient.isAuthenticated()) &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          updateClient(authClient);
          resolve(authClient);
        } else {
          let userObject = {
            principal: "Not Connected.",
            agent: undefined,
            provider: "",
          };
          if (provider === "plug") {
            userObject = await PlugLogin();
            console.log("plug provider", userObject);
          } else if (provider === "stoic") {
            userObject = await StoicLogin();
          } else if (provider === "nfid") {
            userObject = await NFIDLogin();
          } else if (provider === "ii") {
            userObject = await IdentityLogin();
          }

          const identity = await userObject.agent._identity;
          const principal = Principal.fromText(userObject.principal);

          if (provider === "plug") {
            const host =
              process.env.DFX_NETWORK === "ic"
                ? userObject.agent._host
                : "http://127.0.0.1:4943";
            const isConnected = await window.ic.plug.requestConnect({
              whitelist,
              host,
            });
            if (isConnected) {
              const userActor = await window.ic.plug.createActor({
                canisterId: process.env.CANISTER_ID_BEGOD_BACKEND,
                interfaceFactory: idlFactory,
              });
              const EXTActor = await window.ic.plug.createActor({
                canisterId: ledgerCanId,
                interfaceFactory: ledgerIdlFactory,
              });
              console.log("in use auth", userActor);
              setBackendActor(userActor);
              setLedgerActor(EXTActor);
            } else {
              throw new Error("Plug connection refused");
            }
          } else {
            const agent = new HttpAgent({ identity });

            const backendActor = createActor(
              process.env.CANISTER_ID_BEGOD_BACKEND,
              { agentOptions: { identity, verifyQuerySignatures: false } }
            );
            const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
            setLedgerActor(ledgerActor1);
            setBackendActor(backendActor);
          }

          console.log(principal.toString());
          setPrincipal(principal.toString());
          setIdentity(identity);
          setIsAuthenticated(true);
          const authData = {
            isAuthenticated: true,
            user: userObject.principal,
            identity: userObject.identity,
          };

          dispatch(setUser(userObject.principal));
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Login error:", error);
        reject(error);
      }
    });
  };

  const logout = async () => {
    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setBackendActor(null);
      setAccountId(null);
      localStorage.removeItem("auth");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const adminlogout = async () => {
    try {
      await authClient?.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setBackendActor(null);
      setAccountId(null);
      localStorage.removeItem("auth");
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Update client state after authentication
  const updateClient = async (client) => {
    try {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      const identity = client.getIdentity();
      setIdentity(identity);

      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());

      const agent = new HttpAgent({ identity });

      const backendActor = createActor(process.env.CANISTER_ID_BEGOD_BACKEND, {
        agentOptions: { identity, verifyQuerySignatures: false },
      });
      const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
      setLedgerActor(ledgerActor1);
      setBackendActor(backendActor);
      setShowButtonLoading(false)
    } catch (error) {
      console.error("Authentication update error:", error);
    }
  };

  const reloadLogin = async () => {
    try {
      if (
        authClient.isAuthenticated() &&
        !(await authClient.getIdentity().getPrincipal().isAnonymous())
      ) {
        console.log("Called");
        updateClient(authClient);
      }
    } catch (error) {
      console.error("Reload login error:", error);
    }
  };

  return {
    adminlogin,
    adminlogout,
    isAuthenticated,
    login,
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    backendActor,
    accountId,
    ledgerActor,
    reloadLogin,
    accountIdString,
    showButtonLoading
  };
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();

  if (!auth.authClient || !auth.backendActor) {
    return null; // Or render a loading indicator
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to access authentication context
export const useAuth = () => useContext(AuthContext);
