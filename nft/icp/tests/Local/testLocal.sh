#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# dfx identity use chandan;
# LEDGERID=$(dfx ledger account-id);
# echo $LEDGERID

USER_PRINCIPAL=$(dfx identity get-principal)
CANISTER=$(dfx canister id BeGod_backend)
echo "USER_PRINCIPAL: $USER_PRINCIPAL"
echo "CANISTER: $CANISTER"



# STEP-1
# creating new collection



# dfx canister call "$CANISTER" createExtCollection '("Celtic", "https://picsum.photos/200/300", "{\"Name\":\"chandan\"}")'

# Getting Result Like this
# (
#   principal "oz7jj-hclyb-5r7nw-ehlam-34yct-ktxcg-2wsq2-53not-tbxed-ru5vq-eae",
#   principal "b77ix-eeaaa-aaaaa-qaada-cai",
# )

COLLECTION_ID="b77ix-eeaaa-aaaaa-qaada-cai"
echo "COLLECTION_ID: $COLLECTION_ID"




# STEP-2
# add nft in the collection

# dfx canister call "$CANISTER" mintExtNonFungible '(
#   principal "'$COLLECTION_ID'",
#   "first nft",
#   "this is the my first nft",
#   "new data",
#   "https://thisisthdata.jpg",
#   opt variant {
#     json = "{\"name\":\"vishwakarma\"}"
#   },
#   1
# )'

# Getting Result Like this of same NFT 10 data
# # (vec {
#     0 : nat32;
#     1 : nat32;
#     2 : nat32;
#     3 : nat32;
#     4 : nat32;
#     5 : nat32;
#     6 : nat32;
#     7 : nat32;
#     8 : nat32;
#     9 : nat32;
#   })

NFTID="0"
echo "NFTID: $NFTID"



# STEP-3
# Getting actual NFT ID TokenIdentifier

# dfx canister call "$CANISTER" getNftTokenId "(principal \"$COLLECTION_ID\", $NFTID)"

# Getting Result Like this
# ("6qcse-gykor-uwjaa-aaaaa-aeaaa-yaqca-aaaaa-a")



# STEP-4
# Set Price and List the NFT

TOKENIDENTIFIER='6qcse-gykor-uwjaa-aaaaa-aeaaa-yaqca-aaaaa-a'
TOKENID='1'
PRICE=100_000_000;
# in e8s
PRICEE8S=100000000;
echo "TOKENIDENTIFIER: $TOKENIDENTIFIER"
echo "PRICE: $PRICE"

# dfx canister call $CANISTER listprice '(principal "'$COLLECTION_ID'", record {token="'$TOKENIDENTIFIER'"; from_subaccount=null; price= opt '$PRICE'})';


# STEP-5
# Get the All NFT listing

# dfx canister call $CANISTER listings '(principal "'$COLLECTION_ID'")';



dfx identity use default;

# # STEP-6
# # Purchase NFT


BUYERIDENTIFIER=$(dfx identity get-principal);
# dfx canister call $CANISTER purchaseNft '(principal "'$COLLECTION_ID'","'$TOKENIDENTIFIER'",'$PRICE',"'$BUYERIDENTIFIER'")';

# (
#   variant {
#     ok = record {
#       "1d9f09ee8c60266ab365b70ce0fa03a0761127e8a4e20711b7115d541cbae424";
#       100_000_000 : nat64;
#     }
#   },
# )






# # STEP-7
# # Send Balance to the Creater
# Note: 1 ICP = 1 * 10^8 = 100000000

PURCHASENFTTXNID='1d9f09ee8c60266ab365b70ce0fa03a0761127e8a4e20711b7115d541cbae424';
# export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)
# echo "DEFAULT_ACCOUNT_ID: $DEFAULT_ACCOUNT_ID"
# CHANDAN_ACCOUNT_ID='1d9f09ee8c60266ab365b70ce0fa03a0761127e8a4e20711b7115d541cbae424';

# block_height=$(dfx canister call icp_ledger_canister send_dfx "(record { 
#     to = \"$PURCHASENFTTXNID\";
#     from = \"$DEFAULT_ACCOUNT_ID\"; 
#     amount = record { e8s = $PRICEE8S : nat64 }; 
#     fee = record { e8s = 10000 : nat64 }; 
#     memo = 0; 
#     created_at_time = null;
# })")

# echo "Transaction sent. Block height: $block_height"

# balance=$(dfx canister call icp_ledger_canister account_balance_dfx "(record {account = \"$DEFAULT_ACCOUNT_ID\";})")
# echo "Balance of the default account: $balance"




# STEP-8
# Settelment NFT


# dfx canister call $CANISTER settlepurchase '(principal "'$COLLECTION_ID'","'$PURCHASENFTTXNID'")';



# STEP-9
# Show NFT Txns

# dfx canister call $CANISTER transactions '(principal "'$COLLECTION_ID'")';