import { AccountIdentifier } from "@dfinity/ledger-icp";
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
    // Debug the input
    console.log("Raw sendAmount input:", sendAmount, typeof sendAmount);

    // Convert sendAmount to proper decimal number first
    const sendAmountDecimal =
      typeof sendAmount === "string"
        ? parseFloat(sendAmount)
        : Number(sendAmount);

    console.log("Parsed sendAmount as decimal:", sendAmountDecimal);

    // Convert to e8s (multiply by 100,000,000) and ensure it's BigInt
    const amnt = BigInt(Math.round(sendAmountDecimal));

    console.log("Amount in e8s:", amnt.toString());

    const accountIdentifier = AccountIdentifier.fromPrincipal({
      principal: principal,
    });

    const balance = await ledgerActor.account_balance({
      account: accountIdentifier.bytes,
    });
    console.log("acnt-idf-balance", balance);

    const metadataResponse = await ledgerActor.icrc1_metadata();
    const metaData = formatTokenMetaData(metadataResponse);

    const ledgerBalance = await ledgerActor.icrc1_balance_of({
      owner: principal,
      subaccount: subAccount,
    });

    console.log("ledgerBalance", ledgerBalance);
    console.log("Comparison:", {
      amountToSend: amnt.toString(),
      availableBalance: ledgerBalance.toString(),
      amountInICP: sendAmountDecimal,
      balanceInICP: Number(ledgerBalance) / 100_000_000,
    });

    // Ensure fee is BigInt
    const fee = metaData?.["icrc1:fee"]
      ? BigInt(metaData["icrc1:fee"])
      : 10_000n;

    // Now both amnt and fee are BigInt, so addition works
    const totalAmount = amnt + fee;

    // Both ledgerBalance and totalAmount are now BigInt
    if (ledgerBalance >= totalAmount) {
      console.log("Sufficient balance for transfer", {
        fee: fee.toString(),
        totalNeeded: totalAmount.toString(),
        available: ledgerBalance.toString(),
      });

      // Your transaction logic here...
      const approvalResponse = await afterPaymentFlow(
        backendActor,
        sendAmountDecimal, // Pass the decimal amount
        transactionId,
        collectionId,
        subAccount,
        ledgerActor,
        metaData
      );

      return approvalResponse;
    } else {
      console.log("Insufficient balance:", {
        required: totalAmount.toString(),
        available: ledgerBalance.toString(),
        requiredICP: Number(totalAmount) / 100_000_000,
        availableICP: Number(ledgerBalance) / 100_000_000,
      });
      return { error: "Insufficient balance" };
    }
  } catch (error) {
    console.error("Error in transferApprove:", error);
    throw error;
  }
};
