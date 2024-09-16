#!/bin/bash
set -e

# Step 2: Create a new identity for the minter account
dfx identity use chandan
export MINTER_ACCOUNT_ID=$(dfx ledger account-id --network ic)
echo "MINTER_ACCOUNT_ID: $MINTER_ACCOUNT_ID"

# Step 3: Switch back to the default identity
dfx identity use chandan
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --network ic)
echo "DEFAULT_ACCOUNT_ID: $DEFAULT_ACCOUNT_ID"

# Step 4: Set token details
export TOKEN_NAME="Local ICP"
export TOKEN_SYMBOL="LICP"
export TRANSFER_FEE=10_000  # 0.0001 ICP in e8s
export PRE_MINTED_TOKENS=10_000_000_000  # Pre-mint 100 ICP tokens in e8s

# Step 5: Deploy the ICRC2 token canister with initialization arguments
dfx deploy icrc2_token_canister --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record {
            e8s = $PRE_MINTED_TOKENS : nat64;
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
" --network ic ;

# Step 6: Confirm deployment and display the token's name
dfx canister call icrc2_token_canister name --network ic ;
echo "ICRC2 token canister deployed and token name retrieved"

# Step 7: Check balance of the default account
balance=$(dfx canister call icrc2_token_canister account_balance_dfx "(record {account = \"$DEFAULT_ACCOUNT_ID\";})" --network ic)
echo "Balance of the default account: $balance"
