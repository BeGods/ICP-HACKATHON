#!/bin/bash
set -e

# Step 2: Use the minter identity (assuming different identity for minter)
dfx identity use chandan
export MINTER_ACCOUNT_ID=$(dfx ledger account-id --network ic)
echo "MINTER_ACCOUNT_ID: $MINTER_ACCOUNT_ID"

# Step 3: Use the default identity (switch to a different identity if needed)
dfx identity use chandan
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --network ic)
echo "DEFAULT_ACCOUNT_ID: $DEFAULT_ACCOUNT_ID"

# Step 4: Set token details
export TOKEN_NAME="Local ICP"
export TOKEN_SYMBOL="LICP"
export TRANSFER_FEE=10_000  # 0.0001 ICP in e8s
export PRE_MINTED_TOKENS=10_000_000_000  # Pre-mint 100 ICP tokens in e8s

# Step 5: Deploy the ICP ledger canister if it doesn't exist already
if ! dfx canister info icp_ledger_canister --network ic; then
  dfx canister create icp_ledger_canister --network ic
fi

# Step 6: Deploy or upgrade the ICP ledger canister with initialization arguments
dfx deploy icp_ledger_canister --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record {
            e8s = 10_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = $TRANSFER_FEE : nat64;
      };
      token_symbol = opt \"$TOKEN_SYMBOL\";
      token_name = opt \"$TOKEN_NAME\";
    }
  })
" --network ic

# Step 7: Confirm deployment and display the token's name
dfx canister call icp_ledger_canister name --network ic
echo "ICP ledger deployed and token name retrieved"

# Step 8: Check the balance of the default account
balance=$(dfx canister call icp_ledger_canister account_balance_dfx "(record {account = \"$DEFAULT_ACCOUNT_ID\";})" --network ic)
echo "Balance of the default account: $balance"
