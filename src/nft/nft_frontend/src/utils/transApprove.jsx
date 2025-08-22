import { Principal } from "@dfinity/principal";

const afterPaymentFlow = async (
  backendActor,
  sendAmount,
  transationId,
  collectionId,
  subAccount,
  ledgerActor,
  metaData
) => {
  try {
    const transactionArg = {
      amount: { e8s: Number(sendAmount) },
      to: transationId,
      fee: { e8s: metaData?.["icrc1:fee"] },
      memo: 0,
      from_subaccount: [],
      created_at_time: [],
    };

    const sendBalanceResult = await ledgerActor.send_dfx(transactionArg);
    if (BigInt(sendBalanceResult) > 0) {
      const response = await backendActor.settlepurchase(
        Principal.fromText(collectionId),
        transationId
      );

      console.log(response, "success1");
      if ("ok" in response && response.ok === null) {
        const finalResult = await backendActor.balance_nft_settelment(
          Principal.fromText(collectionId)
        );
        if (finalResult === undefined) {
          console.log("congratutation");
          return true;
        } else {
          console.log("balance settelment failed");
          return false;
        }
      }
    } else {
      console.log("no balance");
      return false;
    }
  } catch (error) {
    console.error("Error in afterPaymentFlow:", error);
    throw error;
  }
};

const formatTokenMetaData = (arr) => {
  const resultObject = {};
  arr.forEach((item) => {
    const key = item[0];
    const value = item[1][Object.keys(item[1])[0]];
    resultObject[key] = value;
  });
  return resultObject;
};

const getBalance = async (backendActor) => {
  let bal = await backendActor.get_balance();
  return parseInt(bal);
};

export const transferApprove = async (
  backendActor,
  ledgerActor,
  sendAmount,
  principal,
  transactionId,
  collectionId,
  subAccount = []
) => {
  try {
    // Fetch ledger metadata to get fee info
    const metadataResponse = await ledgerActor.icrc1_metadata();
    const metaData = formatTokenMetaData(metadataResponse);
    console.log(sendAmount, metaData, "metaData");

    // Convert sendAmount from ICP decimal to e8s bigint
    const amnt = BigInt(Math.floor(Number(sendAmount) * 1e8));

    console.log("principal", principal);

    // Query balance from ledger for principal with specified subaccount
    const ledgerBalance = await ledgerActor.icrc1_balance_of({
      owner: principal,
      subaccount: subAccount,
    });

    console.log(amnt.toString(), ledgerBalance.toString(), "amount vs balance");

    // Parse fee from metadata or default to 10_000 e8s (0.0001 ICP)
    const fee = metaData?.["icrc1:fee"]
      ? BigInt(metaData["icrc1:fee"])
      : 10_000n;

    // Total amount required: send amount + fee
    const totalAmount = amnt + fee;

    if (ledgerBalance >= totalAmount) {
      console.log("Sufficient balance for transfer", { fee: fee.toString() });

      // Create approval transaction arguments
      const transaction = {
        amount: amnt,
        from_subaccount: subAccount,
        spender: {
          owner: Principal.fromText(process.env.CANISTER_ID_NFT_BACKEND),
          subaccount: [],
        },
        fee: [fee],
        memo: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      };

      // Call ledgerActor approve (uncomment if using icrc2_approve)
      // const approvalResponse = await ledgerActor.icrc2_approve(transaction);

      // Or proceed with afterPaymentFlow for your business logic
      const approvalResponse = await afterPaymentFlow(
        backendActor,
        Number(sendAmount),
        transactionId,
        collectionId,
        subAccount,
        ledgerActor,
        metaData
      );

      console.log("approvalResponse", approvalResponse);
      return approvalResponse;
    } else {
      console.log("Insufficient balance:", {
        required: totalAmount.toString(),
        available: ledgerBalance.toString(),
      });
      return { error: "Insufficient balance" };
    }
  } catch (error) {
    console.error("Error in transferApprove:", error);
    throw error;
  }
};
