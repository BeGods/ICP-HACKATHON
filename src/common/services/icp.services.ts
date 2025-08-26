import { Principal } from "@dfinity/principal";
import { initializeICPActor } from "../../config/icp";

export const registerFOFQuestCmpl = async (user, mythologyName) => {
  try {
    const principalId = user.principalId;
    const { backendActor, userPrincipal } = await initializeICPActor(
      principalId
    );

    if (!backendActor || !userPrincipal) {
      throw new Error("Failed to initalize backend actor");
    }

    const principal = Principal.fromText(principalId);

    console.log(principal, mythologyName);

    const testResult2 = await backendActor.registerQuestCompletion(
      principal,
      mythologyName
    );

    console.log(testResult2);
    return testResult2;
  } catch (error) {
    console.log(error);
  }
};

export const mintQuestPackets = async (user, mythology) => {
  try {
    const principalId = user.principalId;
    const { backendActor, userPrincipal } = await initializeICPActor(
      principalId
    );

    if (!backendActor || !userPrincipal) {
      throw new Error("Failed to initalize backend actor");
    }

    const principal = Principal.fromText(principalId);

    const testResult2 = await backendActor.mintPacketToUser(
      principal,
      mythology
    );

    console.log(testResult2);
    return testResult2;
  } catch (error) {
    console.log(error);
  }
};
