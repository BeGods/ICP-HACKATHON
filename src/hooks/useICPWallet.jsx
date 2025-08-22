import { useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { StoicLogin, NFIDLogin } from "ic-auth";
import { authenticateICP } from "../utils/api.fof";
import { setAuthCookie } from "../helpers/cookie.helper";
import { useStore } from "../store/useStore";

const iiUrl = "https://identity.ic0.app";
const tele = window.Telegram?.WebApp;

const useICPWallet = () => {
  const setAuthToken = useStore((c) => c.setAuthToken);
  const [signature, setSignature] = useState(null);

  const connectICPWallet = async (provider) => {
    try {
      const authClient = await AuthClient.create();

      let identity;
      let agent;

      // --- Handle Plug ---
      if (provider === "plug") {
        const host = "http://127.0.0.1:4943";

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

        // Sign "abcd"
        const signResult = await window.ic.plug.requestSignMessage({
          message: "abcd",
        });

        setSignature(signResult.signature);
      }

      // --- Handle Stoic ---
      else if (provider === "stoic") {
        const stoicIdentity = await StoicLogin();
        identity = stoicIdentity;

        agent = new HttpAgent({ identity });
        if (process.env.DFX_NETWORK !== "ic") {
          agent.fetchRootKey();
        }

        // Sign "abcd"
        const msg = new TextEncoder().encode("abcd");
        const signResult = await identity.sign(msg);
        setSignature(signResult.signature);
      }

      // --- Handle NFID ---
      else if (provider === "nfid") {
        const nfidIdentity = await NFIDLogin({ identityProvider: nfidUrl });
        identity = nfidIdentity;

        agent = new HttpAgent({ identity });
        if (process.env.DFX_NETWORK !== "ic") {
          agent.fetchRootKey();
        }

        // Sign "abcd"
        const msg = new TextEncoder().encode("abcd");
        const signResult = await identity.sign(msg);
        setSignature(signResult.signature);
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
        const principal = identity.getPrincipal().toText();

        const response = await authenticateICP(principal, null);
        setAuthToken(response.data.accessToken);
        await setAuthCookie(tele, response.data.accessToken);
        window.location.reload();
      }

      if (!identity) throw new Error("No identity returned from provider");

      const principal = identity.getPrincipal();
      console.log("✅ Logged in as", principal.toText());
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return {
    connectICPWallet,
  };
};

export default useICPWallet;
