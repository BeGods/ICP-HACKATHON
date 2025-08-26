import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  createActor,
  idlFactory as backend_idl,
  canisterId,
} from "../../../../declarations/nft_backend";
import { createActor as createLedgerActor } from "../../../../declarations/icp_ledger_canister/index";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";
import { idlFactory } from "../../../../declarations/nft_backend/index";
import { idlFactory as ledgerIdlFactory } from "../../../../declarations/icp_ledger_canister/index";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { updateDisplayWalletOptionsStatus } from "../redux/infoSlice";
import { PlugMobileProvider } from "@funded-labs/plug-mobile-sdk";
import MobileProvider from "@funded-labs/plug-mobile-sdk/dist/src/MobileProvider";

// Create a React context for authentication state
const AuthContext = createContext();

const iiUrl =
  process.env.DFX_NETWORK === "local"
    ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`
    : "https://identity.ic0.app";

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
      console.log("authclient trigger was called");

      updateClient(authClient);
    }
  }, [authClient]);

  const backend_id = process.env.CANISTER_ID_NFT_BACKEND;
  const frontend_id = process.env.CANISTER_ID_NFT_FRONTEND;
  const ledgerCanId = process.env.CANISTER_ID_ICP_LEDGER_CANISTER;

  // testnet
  // mainnet
  // const ledgerCanId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  const whitelist = [backend_id, ledgerCanId, frontend_id];

  async function plugConnectMobile() {
    try {
      // Check if the user is on a mobile device
      const isMobile = PlugMobileProvider.isMobileBrowser();

      if (isMobile) {
        // Initialize PlugMobileProvider for mobile
        const provider = new PlugMobileProvider({
          debug: true,
          walletConnectProjectId: "143e95d92fffc4fe5b2355904907a616",
          window: window,
        });

        // Initialize the provider
        await provider.initialize();

        // Check if the provider is already paired
        if (!provider.isPaired()) {
          // Pair the provider
          await provider.pair();
        }

        // Create the agent with the provider
        const agent = await provider.createAgent({
          host: "https://icp0.io",
          targets: whitelist,
        });

        const actor = await createActor(process.env.CANISTER_ID_NFT_BACKEND, {
          agent,
        });
        console.log(actor, "mobile actor");

        // const principal = await window.ic.plug.agent.getPrincipal();
        // console.log(principal, "principal");

        const user_uuid = uuidv4();
        // // Create actor for the backend
        // const userActor = await window.ic.plug.createActor({
        //   canisterId: process.env.CANISTER_ID_NFT_BACKEND,
        //   interfaceFactory: idlFactory,
        // });

        // // Create actor for the ledger
        // const EXTActor = await window.ic.plug.createActor({
        //   canisterId: ledgerCanId,
        //   interfaceFactory: ledgerIdlFactory,
        // });

        // userObject.principal = principal.toText();
        // userObject.agent = window.ic.plug.agent;

        // // Create user with the principal and user UUID
        const userdetails = await actor.create_user(
          await agent.getPrincipal(),
          user_uuid
        );
        console.log(userdetails, "userdetails");
        setBackendActor(actor);
        // setLedgerActor(EXTActor);
      } else {
        // If not a mobile device, fallback to desktop Plug connection
        const pubKey = await window.ic.plug.requestConnect({ whitelist });
        const actor = await window.ic.plug.createActor({
          canisterId: process.env.CANISTER_ID_NFT_BACKEND,
          interfaceFactory: idlFactory,
        });
        console.log("plug desk actor created", actor);

        // Verify connection and fetch data
        const res = await actor.whami();
        console.log(res);
        setBackendActor(actor);
        setPrincipal(res);
      }
    } catch (err) {
      console.error("Error in plugConnectMobile:", err);
      alert(err.message || "An error occurred while connecting.");
    }
  }

  const login = async (provider, navigatingPath) => {
    return new Promise(async (resolve, reject) => {
      setShowButtonLoading(true);
      try {
        const authClient = await AuthClient.create();
        const canister = Principal.fromText(backend_id);

        // --- If already logged in with II ---
        if (
          (await authClient.isAuthenticated()) &&
          !authClient.getIdentity().getPrincipal().isAnonymous()
        ) {
          await updateClient(authClient, canister);
          resolve(authClient);
          return;
        }

        let identity;
        let agent;
        let backendActor;
        let ledgerActor1;
        let principal;

        // --- Handle Plug ---
        if (provider === "plug") {
          if (!window.ic?.plug) throw new Error("Plug extension not installed");

          const host =
            process.env.DFX_NETWORK === "ic"
              ? "https://icp-api.io"
              : "http://127.0.0.1:4943";

          const isConnected = await window.ic.plug.requestConnect({
            whitelist,
            host,
          });
          if (!isConnected) throw new Error("Plug connection refused");

          identity = await window.ic.plug.agent.getIdentity();
          principal = identity.getPrincipal();

          backendActor = await window.ic.plug.createActor({
            canisterId: process.env.CANISTER_ID_NFT_BACKEND,
            interfaceFactory: idlFactory,
          });

          ledgerActor1 = await window.ic.plug.createActor({
            canisterId: ledgerCanId,
            interfaceFactory: ledgerIdlFactory,
          });

          // Create user on backend
          const user_uuid = uuidv4();
          await backendActor.create_user(principal, user_uuid);
        }

        // --- Handle Stoic ---
        else if (provider === "stoic") {
          identity = await StoicLogin();
          principal = identity.getPrincipal();

          agent = new HttpAgent({ identity });
          if (process.env.DFX_NETWORK !== "ic") agent.fetchRootKey();

          backendActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });
          ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
        }

        // --- Handle NFID ---
        else if (provider === "nfid") {
          identity = await NFIDLogin({ identityProvider: nfidUrl });
          principal = identity.getPrincipal();

          agent = new HttpAgent({ identity });
          if (process.env.DFX_NETWORK !== "ic") agent.fetchRootKey();

          backendActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });
          ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
        }

        // --- Handle Internet Identity ---
        else if (provider === "ii") {
          await new Promise((resolveLogin, rejectLogin) => {
            authClient.login({
              identityProvider: iiUrl,
              onSuccess: resolveLogin,
              onError: rejectLogin,
            });
          });

          identity = authClient.getIdentity();
          principal = identity.getPrincipal();

          agent = new HttpAgent({ identity });
          if (process.env.DFX_NETWORK !== "ic") agent.fetchRootKey();

          backendActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });
          ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
        } else {
          throw new Error("Unsupported provider");
        }

        if (!identity) throw new Error("No identity returned from provider");

        console.log("✅ User Logged in as", principal.toText());

        setLedgerActor(ledgerActor1);
        setBackendActor(backendActor);
        setPrincipal(principal.toString());
        setIdentity(identity);
        setIsAuthenticated(true);
        dispatch(setUser(principal.toText()));
        dispatch(updateDisplayWalletOptionsStatus(false));

        if (navigatingPath === "/profile") navigate(navigatingPath);

        resolve({ identity, principal, backendActor, ledgerActor1 });
      } catch (error) {
        console.error("Login error:", error);
        reject(error);
      } finally {
        setShowButtonLoading(false);
      }
    });
  };

  const adminlogin = async (provider) => {
    return new Promise(async (resolve, reject) => {
      try {
        const authClient = await AuthClient.create();
        const canister = Principal.fromText(backend_id);

        // --- If already logged in with II ---
        if (
          (await authClient.isAuthenticated()) &&
          !authClient.getIdentity().getPrincipal().isAnonymous()
        ) {
          await updateClient(authClient, canister);
          resolve(authClient);
        }

        let identity;
        let agent;
        let backendActor;
        let ledgerActor1;

        // --- Handle Plug ---
        if (provider === "plug") {
          const host =
            process.env.DFX_NETWORK === "ic"
              ? userObject.agent._host
              : "http://127.0.0.1:4943";

          const isConnected = await window.ic.plug.requestConnect({
            whitelist,
            host,
          });

          if (!isConnected) throw new Error("Plug connection refused");

          backendActor = await window.ic.plug.createActor({
            canisterId: process.env.CANISTER_ID_NFT_BACKEND,
            interfaceFactory: idlFactory,
          });
          ledgerActor1 = await window.ic.plug.createActor({
            canisterId: ledgerCanId,
            interfaceFactory: ledgerIdlFactory,
          });

          identity = await window.ic.plug.agent.getIdentity();
        }

        // --- Handle Stoic ---
        else if (provider === "stoic") {
          const stoicIdentity = await StoicLogin();
          identity = stoicIdentity;

          agent = new HttpAgent({ identity });
          if (process.env.DFX_NETWORK !== "ic") {
            agent.fetchRootKey();
          }

          backendActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });
          ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
        }

        // --- Handle NFID ---
        else if (provider === "nfid") {
          const nfidIdentity = await NFIDLogin({ identityProvider: nfidUrl });
          identity = nfidIdentity;

          agent = new HttpAgent({ identity });
          if (process.env.DFX_NETWORK !== "ic") {
            agent.fetchRootKey();
          }

          backendActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });
          ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
        }

        // --- Handle Internet Identity (fallback) ---
        else if (provider === "ii") {
          await new Promise((resolveLogin, rejectLogin) => {
            authClient.login({
              identityProvider: iiUrl,
              onSuccess: resolveLogin,
              onError: rejectLogin,
            });
          });

          identity = authClient.getIdentity();
          agent = new HttpAgent({ identity });
          if (process.env.DFX_NETWORK !== "ic") {
            agent.fetchRootKey();
          }

          backendActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });
          ledgerActor1 = createLedgerActor(ledgerCanId, { agent });
        }

        if (!identity) throw new Error("No identity returned from provider");

        const principal = identity.getPrincipal();
        console.log("✅ Logged in as", principal.toText());

        // await backendActor.checkController(canister, principal);
        // await backendActor.whoAmI();

        setLedgerActor(ledgerActor1);
        setBackendActor(backendActor);
        setPrincipal(principal.toString());
        setIdentity(identity);
        setIsAuthenticated(true);
        console.log("dispatch-user", principal.toText());
        dispatch(setUser(principal.toText()));
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
      dispatch(setUser(null));
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
      const isConnected = await client.isAuthenticated();

      console.log("isConnected", isConnected);

      const identity = client.getIdentity();
      const agent = new HttpAgent({ identity });

      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey();
      }

      const backendActor = Actor.createActor(backend_idl, {
        agent,
        canisterId: backend_id, // string from .env
      });

      const ledgerActor1 = createLedgerActor(ledgerCanId, { agent });

      const principal = identity.getPrincipal();
      console.log("✅ Logged in as", principal.toText());

      // Make sure backend_id is not undefined
      if (!backend_id)
        throw new Error("backend_id is undefined. Check your .env setup!");

      // test all good
      // await backendActor.checkController(canisterIdPrincipal, principal);
      // await backendActor.whoAmI();

      setIsAuthenticated(isConnected);
      setIdentity(identity);
      setPrincipal(principal.toString());
      setLedgerActor(ledgerActor1);
      setBackendActor(backendActor);
      setShowButtonLoading(false);
      console.log("dispatch-user", principal.toText());

      const isAnonymous = await principal.isAnonymous();

      if (!isAnonymous) {
        dispatch(setUser(principal.toText()));
      }
    } catch (error) {
      console.error("Authentication update error:", error);
    }
  };

  const reloadLogin = async () => {
    try {
      console.log("reload login was called");

      const isAnonymous = await authClient
        .getIdentity()
        .getPrincipal()
        .isAnonymous();

      if (authClient.isAuthenticated() && !isAnonymous) {
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
    showButtonLoading,
    plugConnectMobile,
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
