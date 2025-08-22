import { initializeICPActor } from "../../config/icp";

export const registerFOFQuestCmpl = async (principalId) => {
  try {
    const { backendActor, userPrincipal } = await initializeICPActor(
      principalId
    );

    if (!backendActor || !userPrincipal) {
      throw new Error("Failed to initalize backend actor");
    }
  } catch (error) {
    console.log(error);
  }
};
