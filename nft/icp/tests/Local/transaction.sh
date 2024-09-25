#!/bin/bash
dfx identity use default;
# Exit immediately if a command exits with a non-zero status
set -e
dfx identity get-principal;
USER_PRINCIPAL=$(dfx identity get-principal)
CANISTER=$(dfx canister id BeGod_backend)
echo "USER_PRINCIPAL: $USER_PRINCIPAL"
echo "CANISTER: $CANISTER"

# export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)
# MINTER_ACCOUNT_ID=d898ce9ed801ccb3051fb6948a42d923ceacf39ac4e7ba98e14fe7c221ead305
DEFAULT_ACCOUNT_ID=be3531619a7b0443a049c2da5cdabb301fba7e8367f53ea65aae42dcb84af223;
CHANDAN_ACCOUNT_ID='sfczs-5f2rv-6x62i-t3ca4-xxetq-h53h3-nrsaf-pjdgy-o7nid-csao7-uqe';

# block_height=$(dfx canister call icp_ledger_canister send_dfx "(record { 
#     to = \"$CHANDAN_ACCOUNT_ID\";
#     from = \"$DEFAULT_ACCOUNT_ID\"; 
#     amount = record { e8s = 100_000_000 : nat64 }; 
#     fee = record { e8s = 10000 : nat64 }; 
#     memo = 0; 
#     created_at_time = null;
# })")




dfx canister call icrc2_token_canister icrc1_transfer "(record { to = record { owner = principal \"2xtmc-5eo2k-c5422-e3fih-uyjbn-fiefs-u72o7-xgn4m-kveqk-7unet-3qe\";}; amount = 1000000;})"





# block_height=$(dfx canister call icp_ledger_canister send_dfx "(record {amount = {e8s = 100_000_000}; created_at_time = null; fee = {e8s = 10_000}; from_subaccount = null; memo = 0; to = "492aacd082a520dfc078678759756ef4ac11133083799c77d4acc7a3490cb5ec"})")




# echo "Transaction sent. Block height: $block_height"
COLLECTION_ID="a3shf-5eaaa-aaaaa-qaafa-cai";
PRICE=100000000;
SUBACCOUNT=null;

# dfx canister call $CANISTER transfer_balance '(principal "'$COLLECTION_ID'","'$CHANDAN_ACCOUNT_ID'",'$PRICE','$SUBACCOUNT')';

# dfx wallet balance


echo "DEFAULT_ACCOUNT_ID: $DEFAULT_ACCOUNT_ID"

# balance=$(dfx canister call icp_ledger_canister account_balance_dfx "(record {account = \"$DEFAULT_ACCOUNT_ID\";})")
# echo "Balance of the default account: $balance"

# # Replace with the recipient principal (or account ID if known)
# RECIPIENT_PRINCIPAL="2ipdv-mwghn-c5x64-fkchv-hbvge-yobre-szmep-6ntkb-d3a3h-w5jg6-zqe"

# # Convert the recipient's principal to their account ID
# RECIPIENT_ACCOUNT_ID=$(dfx ledger account-id --of-principal "$RECIPIENT_PRINCIPAL")

# # Display the recipient account ID
# echo "RECIPIENT_ACCOUNT_ID: $RECIPIENT_ACCOUNT_ID"

# # Check and display the balance of the recipient account
# recipient_balance=$(dfx canister call icp_ledger_canister account_balance_dfx "(record {account = \"$RECIPIENT_ACCOUNT_ID\";})")
# echo "Balance of the recipient account: $recipient_balance"