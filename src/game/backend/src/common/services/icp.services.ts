import { Principal } from "@dfinity/principal";
import { initializeICPActor } from "../../config/icp";

export const registerFOFQuestCmpl = async () => {
  try {
    const principalId =
      "rvi6j-xlkfg-heqy3-a6nb2-g7scc-a7q3r-t5fsn-xus4t-chhqi-mnnhs-4qe";
    const { backendActor, userPrincipal } = await initializeICPActor(
      principalId
    );

    if (!backendActor || !userPrincipal) {
      throw new Error("Failed to initalize backend actor");
    }

    const principal = Principal.fromText(principalId);

    const testResult2 = await backendActor.registerQuestCompletion(principal);

    console.log(testResult2);
  } catch (error) {
    console.log(error);
  }
};

export const mintQuestPackets = async () => {
  try {
    const principalId =
      "rvi6j-xlkfg-heqy3-a6nb2-g7scc-a7q3r-t5fsn-xus4t-chhqi-mnnhs-4qe";
    const { backendActor, userPrincipal } = await initializeICPActor(
      principalId
    );

    if (!backendActor || !userPrincipal) {
      throw new Error("Failed to initalize backend actor");
    }

    const principal = Principal.fromText(principalId);

    const time = BigInt(Date.now());

    const testResult2 = await backendActor.mintNFTToUser(principal, time);

    console.log(testResult2);
  } catch (error) {
    console.log(error);
  }
};
