import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    createActor as createActorBackend,
} from '../../../declarations/BeGod_backend/index';
// import { Actor, HttpAgent } from "@dfinity/agent";
const AuthContext = createContext();
console.log(process.env.DFX_NETWORK)
const defaultOptions = {
    /**
     *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
     */
    createOptions: {
        // idleOptions: {
        //   // Set to true if you do not want idle functionality
        //   disableIdle: true,
        // },
        idleOptions: {
            idleTimeout: 1000 * 60 * 30, // set to 30 minutes
            disableDefaultIdleCallback: true, // disable the default reload behavior
        },
    },
    /**
     * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
     */
    loginOptionsIcp: {
        identityProvider:
            process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#"
                : `https://identity.ic0.app/#`,
    },
    loginOptionsnfid: {
        identityProvider:
            process.env.DFX_NETWORK === "ic"
                ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
                : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
    },
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authClient, setAuthClient] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [backendActor, setBackendActor] = useState(null)
    useEffect(() => {
        // Initialize AuthClient
        AuthClient.create(options.createOptions).then((client) => {
            setAuthClient(client);
        });
    }, []);
    const backendCanisterId = process.env.CANISTER_ID_BeGod_BACKEND;
    const login = (val) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(AuthClient)
                if (authClient?.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                    console.log("line 8")
                    const backendActor = createActorBackend(backendCanisterId, { agentOptions: { identity: identity } });
                    setBackendActor(backendActor);
                    updateClient(authClient);
                    resolve(AuthClient);
                    console.log("logged in");
                } else {
                    let opt = val === "Identity" ? "loginOptionsIcp" : "loginOptionsnfid"
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
        })
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

    const reloadLogin = () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                    updateClient(authClient);
                    resolve(AuthClient);
                }
            } catch (error) {
                reject(error);
            }
        })
    };

    async function updateClient(client) {
        const isAuthenticated = await client.isAuthenticated();
        setIsAuthenticated(isAuthenticated);
        const identity = client.getIdentity();
        
        setIdentity(identity);
        
       // console.log("principal...........",principal);
        setPrincipal(principal);
        setAuthClient(client);
        // console.log(identity);
    }



    async function logout() {
        await authClient?.logout();
        await updateClient(authClient);
        setIsAuthenticated(false);
    }

    // const createTokenActor = (canisterID) => {
    //     let tokenActor = ledgerActor(canisterID, { agentOptions: { identity: identity } })
    //     return tokenActor;

    //         }
    // const canisterId =
    //     process.env.CANISTER_ID_CKETH_LEDGER

    // const actor = createActorBackend(canisterId, { agentOptions: { identity } });

    // const getBalance = async (principal, canisterId) =>{
    //     const actor = await createTokenActor(canisterId)
    //     const balance = await actor.icrc1_balance_of({ owner: principal, subaccount: [] })
    //     setBalance(balance)
    //     console.log("initialActor", actor)
    //     return balance;
    //    }


    return {
        login,
        logout,
        principal,
        isAuthenticated,
        setPrincipal,
        identity,
        backendActor,
        reloadLogin,
    };
};

/**
 * @type {React.FC}
 */
export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);