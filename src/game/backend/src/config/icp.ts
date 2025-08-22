import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Ed25519KeyIdentity } from "@dfinity/identity";

let backend_idl;
const backend_canister_id = process.env.CANISTER_ID_NFT_BACKEND;

export const initializeICPActor = async (userPrincipalText) => {
  if (!userPrincipalText) throw new Error("User principal is required");

  const identity = Ed25519KeyIdentity.generate();
  const userPrincipal = Principal.fromText(userPrincipalText);

  ({ idlFactory: backend_idl } = await import(
    "../../../../declarations/nft_backend"
  ));

  const agent = new HttpAgent({
    host:
      process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app" // mainnet
        : "http://127.0.0.1:4943", // local dfx
    identity,
  });

  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey();
  }

  const backendActor = Actor.createActor(backend_idl, {
    agent,
    canisterId: backend_canister_id,
  });

  console.log(backendActor);

  return { backendActor, userPrincipal };
};
